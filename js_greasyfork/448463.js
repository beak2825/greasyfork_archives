// ==UserScript==
// @name         Country Flag Displayer
// @description  Add a flag of the user country after username and/or a coat of arms under the username on Geoguessr user profile pages.
// @version      1.0.6
// @license      MIT
// @author       HugoBarjot#0332
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @require      https://unpkg.com/country-flag-emoji@latest/dist/country-flag-emoji.umd.js
// @namespace	 https://pastebin.com/5wbjjwwr
// @namespace    https://openuserjs.org/scripts/HugoBarjot/Country_Flag_Displayer
// @namespace	 https://greasyfork.org/fr/scripts/448463-country-flag-displayer
// @downloadURL https://update.greasyfork.org/scripts/448463/Country%20Flag%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/448463/Country%20Flag%20Displayer.meta.js
// ==/UserScript==

//You can check the full list of flags and coat of arms looks on this website : https://simplecountrypedia.netlify.app/
//Be aware that some countries have no coat of arms available, u can check the full list here also : https://mainfacts.com/coat-of-arms-countries-world

//Replace true or false after '=' to enable or disable the set of  flags

//You can choose between 2 sets of flag wich will be displayed next to the username, make sure to replace the = value to true on only one between these 2 sets
const type_flag_normalflag_from_flagpedia = true   //flag from flagpedia api
const type_flag_normalflag_from_geoguessr = false  //flag from geoguessr api (similar to flagpedia)

//You can also choose to diplay a coat of arms of the country under the username. The width image size can be set and height is automatic to not disproportionate images. Replace value to false or true to disable or enable it. :)
const type_flag_coat_of_arms = true                //coat of arms from mainfacts.com

//If u want to change the size of the coat of arms, u can lower or higher the value below (some coat of arms have height bigger than others because their shape differ). I found 120 value was the best overall look for me.
let size_coat_of_arm = 96

//If u want to add add a country that you can't pick from the geoguessr profile setttings page, you can replace below the value 'null' with the unicode you want use, be sure to add only 2 lowercase letters) example for antartica unicode : 'aq'
//full list of unicodes on this wiki page : https://en.wikipedia.org/wiki/Regional_indicator_symbol
//After you change the unicode, save script and reload your profile page, you should see the flag of the country you wrote appear, once done no need to keep this unicode, replace it again to 'null' to not overwrite it everytime on your profile :)
//Examples : 'aq' for antartica, 'ad' for Ascension Island...
//Always replace text to 'null' after unicode is writen : 'null'
let your_unicode = 'null'


//Begin Code
let chosen_normal_flag = 'null';
let chosen_coat_of_arms = 'null';
const reg = /^[a-z]{2}/g;
let reg_test = null;
let unicode_change_url = 'https://geoguessr.com/api/v3/profiles/'


function add_your_unicode(unicode){
    if (unicode !== 'null'){
        let reg_test = reg.test(unicode);
        //console.log(reg_test);
        if (reg_test === true){
            let promise = fetch(unicode_change_url, {
                method: 'PUT', body: `{"countryCode":"${unicode}"}`,
                headers: {
                "Content-Type": "application/json; charset=UTF-8" //pour un corps de type chaine
                },
                credentials: 'include'
                })
           window.alert("Unicode writen succesfully, Reload and make sure to replace again the unicode value to 'null' :)");
        }
        if (reg_test === false ){
                window.alert("Make sure the first two letters of the unicode are in lowercase letters :)")
        }
    }
    else {
    }
}

function check_normal_flag() {
    if (type_flag_normalflag_from_flagpedia === true && type_flag_normalflag_from_geoguessr === false){
        chosen_normal_flag = 'https://flagcdn.com';
    }
    else if (type_flag_normalflag_from_geoguessr === true && type_flag_normalflag_from_flagpedia === false){
        chosen_normal_flag = 'https://www.geoguessr.com/static/flags';
    }
    else {
        window.alert("Make sure to check that only one type of normal flag is set to true on Country Flag Displayer script :)");
    }
}

function check_coat_of_arms_flag() {
    if (type_flag_coat_of_arms === true){
       chosen_coat_of_arms = 'https://mainfacts.com/media/images/coats_of_arms';
    }
    else {
        chosen_coat_of_arms = 'null';
    }
}

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl && ((url.startsWith("https://www.geoguessr.com/") && url.includes("/user/")) || (url.startsWith("https://www.geoguessr.com/") && url.includes("/profile")))) {
    lastUrl = url;
    on_profile_page_change();
  }
}).observe(document, {subtree: true, childList: true});

function on_profile_page_change() {
  if (!location.href.includes("/condition_to_avoid_infinite_refresh")) {
    location.reload();
  }
}

// Function to remove geoguessr flag elements
function removeFlagDiv() {
  const flagDiv = document.querySelector('.user-nick_flag__xqaUi');
  if (flagDiv) {
    flagDiv.remove();
  }
}

window.onload = function() {
    removeFlagDiv();
    check_normal_flag();
    check_coat_of_arms_flag();
    add_your_unicode(your_unicode);
    if (lastUrl.startsWith("https://www.geoguessr.com/")&& lastUrl.includes("/user/")){
    const data = document.querySelectorAll("#__NEXT_DATA__")[0].text;
    const json = JSON.parse(data);
    const code_country = json.props.pageProps.user.countryCode;
    add_flag(code_country);
    }
    if (lastUrl.startsWith("https://www.geoguessr.com/")&& lastUrl.includes("/profile")){
    const data = document.querySelectorAll("#__NEXT_DATA__")[0].text;
    const json = JSON.parse(data);
    const code_country = json.props.middlewareResults[1].account.user.countryCode;
    add_flag(code_country);
    }

    function add_flag(code_iso) {
      if (code_iso !== null){
      const img = document.createElement('img');
        if (chosen_normal_flag === 'https://www.geoguessr.com/static/flags'){
            img.setAttribute('src', chosen_normal_flag+`/${code_iso.toUpperCase()}.svg`);
        }
        else{
            img.setAttribute('src', chosen_normal_flag+`/${code_iso}.svg`);
        }
      img.id = "flag";
      img.setAttribute('style', `margin-left:0.4rem;margin-top:0.4rem;vertical-align: middle;border-radius:0.125rem`);
      img.setAttribute('alt', `country code : ${code_iso}`);
      const data_country = countryFlagEmoji.get(`${code_iso}`);
      const name_country_text = JSON.stringify(data_country.name)
      const regex_name = /"/g
      img.setAttribute('title', `${(name_country_text.replace(regex_name, ''))}`);
      img.setAttribute('width', 30);
      img.setAttribute("onerror", "this.onerror=null; this.remove();");
      const svg_flag_location = document.querySelectorAll('h2[class="headline_heading__c6HiU headline_sizeLarge__DqYNn"]')[0].firstChild;
      svg_flag_location.appendChild(img);

        if (chosen_coat_of_arms === 'https://mainfacts.com/media/images/coats_of_arms'){
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", "coat_of_arms");
            newDiv.setAttribute('style', `height:auto;`);
            const reference_node = document.querySelectorAll('div[class="profile-header_accountInfoWrapper__D_iCA"]')[0];
            reference_node.after(newDiv);
            const img_coat_of_arms = document.createElement('img');
            img_coat_of_arms.setAttribute('src', chosen_coat_of_arms+`/${code_iso}.svg`);
            img_coat_of_arms.setAttribute('width', size_coat_of_arm);
            img_coat_of_arms.setAttribute('style', `margin-right:2rem;`);
            img_coat_of_arms.setAttribute("onerror", "this.onerror=null; this.remove();");
            const svg_coat_of_arms_location = document.querySelector("#coat_of_arms");;
            svg_coat_of_arms_location.appendChild(img_coat_of_arms);
        }
      }
    }
}