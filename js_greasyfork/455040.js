function getLinks(idCode){
     return {
           'Jav Trailers' : `https://javtrailers.com/search/${idCode}`,
           'Noodle Mag' : `https://noodlemagazine.com/video/${idCode}`,
           'Ark Jav' : `https://arkjav.com/?s=${idCode}`,
           'Arc Jav' : `https://arcjav.com/?s=${idCode}`,
           'JavGG' : `https://javgg.me?s=${idCode}`,
           'Jav357' : `https://javx357.com/?s=${idCode}`,
           'Missav' : `https://missav.com/en/search/${idCode}`,
           'Original' : `https://sukebei.nyaa.si/?f=0&c=0_0&q=${idCode}`,
           'One Jav' : `https://onejav.com/search/${idCode}`,
           'SXTB' : `https://sextb.net/search/${idCode}`,
           'CATSUB' : `https://www.subtitlecat.com/index.php?search=${idCode}`,
           'Jav Lib' : `http://www.javlibrary.com/en/vl_searchbyid.php?keyword=${idCode}`
     }
}

function getLinkTags(idCode,className){
   isSeperateNeeded = className ? true: false;
   const links = getLinks(idCode);
   let link = isSeperateNeeded ? '<ul>' : '';
   Object.keys(links).map(val=>{
       link += `${isSeperateNeeded ? '<li>' : ''}<a class='${className}' target='_blank' href='${links[val]}'>${val}</a>${isSeperateNeeded ? '</li>' : ''}`;
   });
   return link;
}
