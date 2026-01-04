// ==UserScript==
// @name         BorisChenTiers
// @namespace    BorisChenTiers
// @version      1
// @author       https://github.com/William-Bulovas
// @grant         GM.xmlHttpRequest
// ==/UserScript==
 
const getHttp = (url) => {
	return new Promise(resolve => {
    GM.xmlHttpRequest({
      method: "GET",
      url: url,
      headers: {
        "Accept": "text/plain"
      },
      onload: resolve
		});
  });
}
 
const scoring = {
    PPR: "PPR",
    Standard: "STANDARD",
    Half: "HALF"
}

const teamNames = {
    standard: "standard",
    yahoo: "yahoo",
    espn: "espn"
}

const suffixForScoring = {
    "PPR": "-PPR",
    "HALF": "-HALF",
    "STANDARD": ""
}
 
const generateTiers = async (scoring, defParse = teamNames.standard) => {
  const tierMap = {};
  
  const wrPromise = getHttp("https://s3-us-west-1.amazonaws.com/fftiers/out/text_WR" + suffixForScoring[scoring] + ".txt")
    .then(response => parseTierText(response.responseText))
  	.then(wrTierMap => Object.assign(tierMap, wrTierMap));
  const rbPromise = getHttp("https://s3-us-west-1.amazonaws.com/fftiers/out/text_RB" + suffixForScoring[scoring] + ".txt")
    .then(response => parseTierText(response.responseText))
  	.then(rbTierMap => Object.assign(tierMap, rbTierMap));
  const qbPromise = getHttp("https://s3-us-west-1.amazonaws.com/fftiers/out/text_QB.txt")
    .then(response => parseTierText(response.responseText))
  	.then(qbTierMap => Object.assign(tierMap, qbTierMap));
  const tePromise = getHttp("https://s3-us-west-1.amazonaws.com/fftiers/out/text_TE" + suffixForScoring[scoring] + ".txt")
    .then(response => parseTierText(response.responseText))
  	.then(teTierMap => Object.assign(tierMap, teTierMap));
  const dstPromise = getHttp("https://s3-us-west-1.amazonaws.com/fftiers/out/text_DST.txt")
    .then(response => {
        if (defParse === teamNames.yahoo) {
            return parseTierText(response.responseText, santizeTeamYahooString);
        } else if (defParse === teamNames.espn) {
            return parseTierText(response.responseText, santizeTeamEspnString);
        }
        return parseTierText(response.responseText)
    })
  	.then(dstTierMap => Object.assign(tierMap, dstTierMap));
  const kPromise = getHttp("https://s3-us-west-1.amazonaws.com/fftiers/out/text_K.txt")
    .then(response => parseTierText(response.responseText))
  	.then(kTierMap => Object.assign(tierMap, kTierMap));
 
  await Promise.all([wrPromise, rbPromise, qbPromise, tePromise, dstPromise, kPromise]);
 
  return tierMap;
}
 
const parseTierText = (rawStr, sanitize = santizeString) => {
  const tierMap = {};
  const tiers = rawStr.split(/\r?\n/);
        
  tiers.forEach((tierStr, tier) => {
    if (tierStr != "") {
      const playerStr = tierStr.substring(tierStr.indexOf(":") + 2);
    
    	const players = playerStr.split(', ');
            
      players.forEach((player) => {
        tierMap[sanitize(player)] = tier;
      });
    }
  });
  
  return tierMap;
}
 
 
const santizeString = (str) => {
  if (str === "Darrell Henderson") {
    str = "darrell henderson jr";
  }
  
	return str.toLowerCase()
    				.replace(/\./g, '')
  					.replace(/'/g, '')
  					.replace(' iii', '')
  					.replace(' ii', '');
};
 
const santizeTeamYahooString = (str) => {
  str = str.substring(0, str.lastIndexOf(" ")); 
  
  if (str === "Washington Football") {
    str = "Washington";
  }
  
  return santizeString(str);
}

const santizeTeamEspnString = (str) => {
  str = str.substring(str.lastIndexOf(" ") + 1, str.length); 
  
  if (str === "Team") {
    str = "Washington";
  }
    
  return santizeString(str);
}


