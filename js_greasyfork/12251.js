// ==UserScript==
// @name         okaymotes
// @namespace    originalokay's emotes
// @version      1.1.0
// @description  Memes to use in unoeme's room
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/12251/okaymotes.user.js
// @updateURL https://update.greasyfork.org/scripts/12251/okaymotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:"http://i.imgur.com/bgMc6yx.gif", width:100, height:90, title:'haha'},
    { src:"http://i.imgur.com/7kekVJZ.gif", width:100, height:80, title:'abandonthread'},
    { src:"http://i.imgur.com/COb9tuY.gif", width:100, height:80, title:'smooch'},
    { src:"http://i.imgur.com/HAOrOzu.jpg", width:100, height:80, title:'fire'},
    { src:"http://i.imgur.com/ni4SGbJ.gif", width:110, height:90, title:'jam'},
    { src:"http://i.imgur.com/nQFMpKl.gif", width:110, height:90, title:'retard'},
    { src:"http://i.imgur.com/tg0Pc6O.jpg", width:110, height:90, title:'rip'},
    { src:"http://i.imgur.com/eR3Pg8U.gif", width:110, height:90, title:'shock'},
    { src:"http://i.imgur.com/Rp1mRoL.gif", width:100, height:80, title:'welcome'},
    { src:"http://i.imgur.com/dI9SDJe.jpg", width:100, height:80, title:'200batkek'},
    { src:"http://i.imgur.com/om9yEV6.png", width:100, height:80, title:'ketchup'},
    { src:"http://i.imgur.com/08nqtTu.jpg", width:100, height:100, title:'lqbait'},
    { src:"http://i.imgur.com/vE5xSZD.png", width:100, height:80, title:'malgosia'},
    { src:"http://i.imgur.com/jsvDspn.jpg", width:100, height:80, title:'pcsmart'},
    { src:"http://i.imgur.com/6YaIWKy.gif", width:100, height:80, title:'really'},
    { src:"http://i.imgur.com/FvHJarZ.gif", width:100, height:80, title:'retardalert'},
    { src:"http://i.imgur.com/ANmofdE.png", width:100, height:80, title:'sadkermit'},
    { src:"http://i.imgur.com/SRltHYY.jpg", width:100, height:80, title:'shaye'},
    { src:"http://i.imgur.com/T8YpUn3.gif", width:100, height:80, title:'spookyskeleton'},
    { src:"http://i.imgur.com/oDUgVFJ.gif", width:100, height:80, title:'3dmaze'},
    { src:"http://i.imgur.com/M2OESFA.gif", width:100, height:80, title:'95'},
    { src:"http://i.imgur.com/lb2frqb.gif", width:100, height:80, title:'cool'},
    { src:"http://i.imgur.com/Jwoz3EQ.jpg", width:100, height:80, title:'exbox'},
    { src:"http://i.imgur.com/bVhyBaD.png", width:100, height:80, title:'eyboss'},
    { src:"http://i.imgur.com/CKa1s8I.gif", width:100, height:80, title:'eyboss2'},
    { src:"http://i.imgur.com/bSgm315.jpg", width:100, height:80, title:'fedorov'},
    { src:"http://i.imgur.com/wsF0GNA.jpg", width:100, height:80, title:'franku'},
    { src:"http://i.imgur.com/rGK8tg3.jpg", width:100, height:80, title:'genetics'},
    { src:"http://i.imgur.com/iKQNFM7.jpg", width:100, height:80, title:'hidenseek'},
    { src:"http://i.imgur.com/SuxkuuR.gif", width:100, height:80, title:'lolno'},
    { src:"http://i.imgur.com/GwJMDCm.gif", width:100, height:80, title:'paperclip'},
    { src:"http://i.imgur.com/54AKfkJ.jpg", width:100, height:80, title:'thuglife'},
    { src:"http://i.imgur.com/I3PpCXL.jpg", width:100, height:80, title:'wandows'},
    { src:"http://i.imgur.com/CjxgmQk.jpg", width:100, height:80, title:'windolan'},
    { src:"http://i.imgur.com/3zF7ERy.jpg", width:100, height:80, title:'wizard'},
    { src:"http://i.imgur.com/NaxGbSW.gif", width:100, height:80, title:'xp'},
    { src:"http://i.imgur.com/H3yxNWl.jpg", width:100, height:80, title:'zipzop'},
    { src:"http://i.imgur.com/Ey0DmyB.jpg", width:80, height:100, title:'000mad'},
    { src:"http://i.imgur.com/6a2u4Qx.jpg", width:80, height:100, title:'200mad'},
    { src:"http://i.imgur.com/fBrZWGD.jpg", width:80, height:100, title:'420blazeit'},
    { src:"http://i.imgur.com/yiZUPGY.gif", width:100, height:80, title:'apple'},
    { src:"http://i.imgur.com/xZcJeR2.gif", width:100, height:80, title:'doit'},
    { src:"http://i.imgur.com/PFJvkjJ.jpg", width:100, height:80, title:'dontcare'},
    { src:"http://i.imgur.com/MokCR67.png", width:100, height:80, title:'everywhere'},
    { src:"http://i.imgur.com/ngg57SV.gif", width:100, height:80, title:'greattime'},
    { src:"http://i.imgur.com/GxdhTjA.gif", width:100, height:80, title:'hello'},
    { src:"http://i.imgur.com/h9CjhhQ.jpg", width:80, height:100, title:'infinitymad'},
    { src:"http://i.imgur.com/L9biXQv.gif", width:100, height:80, title:'jam2'},
    { src:"http://i.imgur.com/qwcwtdd.png", width:100, height:80, title:'margaret3000'},
    { src:"http://i.imgur.com/7uYZsYL.jpg", width:100, height:80, title:'ohgod'},
    { src:"http://i.imgur.com/G2X6S8H.gif", width:100, height:80, title:'princess'},
    { src:"http://i.imgur.com/Wy28CDW.gif", width:100, height:80, title:'reflowered'},
    { src:"http://i.imgur.com/2eHOObO.jpg", width:100, height:80, title:'theedge'},
    { src:"http://i.imgur.com/5U7rdAH.gif", width:100, height:80, title:'wave'},
    { src:"http://i.imgur.com/YMnuNdq.gif", width:100, height:80, title:'you'},
    { src:"http://i.imgur.com/mdRnmOs.jpg", width:100, height:80, title:'youfatcat'},
    { src:"http://i.imgur.com/B9lxuyr.gif", width:100, height:80, title:'badassbitch'},
    { src:"http://i.imgur.com/j6SktUp.jpg", width:100, height:80, title:'bighappyfrog'},
    { src:"http://i.imgur.com/tgsM3dN.jpg", width:100, height:80, title:'creep'},
    { src:"http://i.imgur.com/DwEhraP.jpg", width:100, height:80, title:'dogepc'},
    { src:"http://i.imgur.com/nbjeDu7.jpg", width:100, height:80, title:'elgato'},
    { src:"http://i.imgur.com/aPheylB.gif", width:100, height:80, title:'falconpunch'},
    { src:"http://i.imgur.com/XgQiZ2w.jpg", width:100, height:80, title:'frisbeedog'},
    { src:"http://i.imgur.com/Mm5Xqu7.jpg", width:100, height:80, title:'itendsnow'},
    { src:"http://i.imgur.com/DzexAG2.gif", width:100, height:80, title:'jam3'},
    { src:"http://i.imgur.com/y49lC13.png", width:100, height:80, title:'jeansman'},
    { src:"http://i.imgur.com/6OBEOv6.png", width:100, height:80, title:'malgosiahappy'},
    { src:"http://i.imgur.com/wpiufnk.jpg", width:80, height:100, title:'malgosiapc'},
    { src:"http://i.imgur.com/cfSDyoo.jpg", width:100, height:80, title:'mightyshrek'},
    { src:"http://i.imgur.com/Pkjs4ID.png", width:60, height:60, title:'motherfuckingnormies'},
    { src:"http://i.imgur.com/iwtbZfU.gif", width:80, height:100, title:'partyhard'},
    { src:"http://i.imgur.com/fQxSHia.jpg", width:100, height:100, title:'pepedank'},
    { src:"http://i.imgur.com/Yl0N3Wk.png", width:100, height:80, title:'pepelegion'},
    { src:"http://i.imgur.com/jIGByf0.gif", width:100, height:100, title:'pepepc'},
    { src:"http://i.imgur.com/O2ts5YO.jpg", width:100, height:100, title:'robinslap'},
    { src:"http://i.imgur.com/1H8BIwS.jpg", width:100, height:80, title:'softeyes'},
    { src:"http://i.imgur.com/q6GvnY7.jpg", width:100, height:80, title:'twoguns'},
    { src:"http://i.imgur.com/A2oIwTU.gif", width:100, height:80, title:'work'},
    { src:"http://i.imgur.com/HXqmKOq.gif", width:100, height:80, title:'agatkacry'},
    { src:"http://i.imgur.com/XaW2nGH.gif", width:100, height:80, title:'agatkarage'},
    { src:"http://i.imgur.com/XkENIb8.gif", width:100, height:80, title:'flying'},
    { src:"http://i.imgur.com/kTrD1Ah.gif", width:100, height:80, title:'fuckmac'},
    { src:"http://i.imgur.com/0FHS4c7.gif", width:100, height:80, title:'fuckpc'},
    { src:"http://i.imgur.com/xlVJJxu.gif", width:100, height:80, title:'fullofmushrooms'},
    { src:"http://i.imgur.com/F1JWGMB.gif", width:100, height:80, title:'glance'},
    { src:"http://i.imgur.com/g6O7BPo.gif", width:100, height:80, title:'haha2'},
    { src:"http://i.imgur.com/qsSNSMo.gif", width:100, height:80, title:'haha3'},
    { src:"http://i.imgur.com/7TcrDoV.gif", width:100, height:80, title:'haha4'},
    { src:"http://i.imgur.com/xtPlEmm.gif", width:100, height:80, title:'jam4'},
    { src:"http://i.imgur.com/X2EfpUN.gif", width:100, height:80, title:'losehair'},
    { src:"http://i.imgur.com/9ALxmmk.gif", width:100, height:80, title:'realagatka'},
    { src:"http://i.imgur.com/velAfra.gif", width:100, height:80, title:'fornemoy'},
    { src:"http://i.imgur.com/JKw0MHB.gif", width:100, height:80, title:'ohjesus'},
    { src:"http://i.imgur.com/kXD5MvK.gif", width:100, height:80, title:'woah'},
    { src:"http://i.imgur.com/pjdgafk.png", width:100, height:80, title:'wow'},
    { src:"http://i.imgur.com/CS1v9EO.gif", width:100, height:80, title:'srsly'},
    { src:"http://i.imgur.com/lWlW7HK.gif", width:100, height:80, title:'chug'},
    { src:"http://i.imgur.com/jAED3T0.gif", width:100, height:80, title:'fuckyou'},
    { src:"http://i.imgur.com/RXtq6bo.jpg", width:100, height:80, title:'help'},
    { src:"http://i.imgur.com/q34wON1.gif", width:100, height:80, title:'hotdog'},
    { src:"http://i.imgur.com/hzBqoKq.gif", width:100, height:80, title:'jam5'},
    { src:"http://i.imgur.com/PJuGlrz.gif", width:100, height:80, title:'laundry'},
    { src:"http://i.imgur.com/AVLIGEW.jpg", width:80, height:100, title:'lube'},
    { src:"http://i.imgur.com/5WRS4L5.gif", width:100, height:80, title:'mindblow'},
    { src:"http://i.imgur.com/Bfb5g5b.gif", width:100, height:80, title:'ohjesus'},
    { src:"http://i.imgur.com/rGLwNVL.gif", width:100, height:80, title:'ohmygod'},
    { src:"http://i.imgur.com/jU9pWlM.gif", width:100, height:80, title:'patpat'},
    { src:"http://i.imgur.com/e60qmUL.gif", width:100, height:80, title:'tigershit'},
    { src:"http://i.imgur.com/srey1U1.png", width:50, height:50, title:'kappa'},
    { src:"http://i.imgur.com/lAvxzzV.png", width:80, height:100, title:'roxy'},
    { src:"http://i.imgur.com/ANvntaN.jpg", width:80, height:100, title:'original'},
    ];


function addEmotes(){
    emotes.forEach(function(emote){
        window.$codes[emote.title || emote.name] = $('<img>', emote)[0].outerHTML;
    });
}
 
function main(){
    if(!window.$codes || Object.keys(window.$codes).length === 0){
        setTimeout(main, 75);
    }else{
        addEmotes();    
    }
}
if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}