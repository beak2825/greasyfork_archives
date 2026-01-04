// ==UserScript==
// @name         auto-rename uptobox
// @namespace    http://tampermonkey.net/
// @version      0.7.8.1
// @description  Enleve le text superflu des fichiers télécharger de type "video" sur uptobox.com
// @author       DEV314R
// @match        https://uptobox.com/*
// @exclude    *.com/becomepremium*
// @exclude    *.com/login?*
// @exclude    *.com/my_account*
// @exclude    *.com/my_files*
// @exclude    *.com/register*
// @exclude    *.com/support*
// @exclude    *.com/ftp*
// @exclude    *.com/stats*
// @exclude    *.com/voucher*
// @exclude    *.com/resellers_list*
// @exclude    *.com/buy*
// @exclude    *.com/payments*
// @run-at     document-end
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/421389/auto-rename%20uptobox.user.js
// @updateURL https://update.greasyfork.org/scripts/421389/auto-rename%20uptobox.meta.js
// ==/UserScript==
/*      ⇃                              DATE                       ⇂⇃                              ()&[]&{}                                          ⇂⇃              enlève tout ce qui a après sans le dernier \.                                                                                                                                                                                                          |                                                                                                                                                 ⇂*/
var f=(/((\.| |%20)((\(|%28|\[|%5B)|)(19|20)\d{2}|(\)|%29|\]|%5D))|(\.| |%20|)((\(|%28|\[|%5B|{)(\S+|\s+|[^ABC]+|.*)(\)|%29|\]|%5D|})(.+(?=\D*\.)|))|(\.| |%20)((FiNAL|DOC|RESTORED|VF|3D|4K|MULTI|CUSTOM|Extended)(\.| |%20)(3D|DOC|(Light|\.LIGHT)|Collectors|VFI|VF2|hdr|CUSTOM|HDLight|MULTI|FRENCH|((\(|%28|\[|%5B)|)(19|20)\d{2}|(\)|%29|\]|%5D)|(\(|%28|\[|%5B|)(2160|1080|720|360)(:?p|)(\)|%29|\]|%5D|)|COMPLETE)|VFF|FRENCH|TRUEFRENCH|MULTi|(\(|%28|\[|%5B|)(2160|1080|720|360)(:?p|)(\)|%29|\]|%5D|)|BDRip|WEBRiP|DVDRIP|HDRip|2160p|1080p|720p|360p)+.+(?=.*\.)|(\.| |%20)(RsTeam|iNTERNAL|INTEGRALE|REMASTERED|EXTENDED|RepaX|REPACK|Netflix|AMZN|Amazon|TRUEFRENCH|bluray|Blu-Ray|UHD|DSNP|(HDR10|HDR)|(10bits|10bit)|HDLight|hdtv|HD720p|HD|APTV|stéréo|Atmos|IMAX)|(\.| |%20)(VFF|VFi|VF|VFFVFQVO|vfstfr)|\.(\[|%5D)60FPS(\[|%5B)|(\.| |%20)(h265|x265|h264|H\.264|x264|(AC3|AVC|AAC|HEVC)(|\.| |%20)(2.0|2.0|5.1)|HEVC)(-|)([\s\S](?=.*\.))+|(\.| |%20)(x265|H265|x264|H264|H.264|AC3)|\.WEB\.DL/gi)

if(/(\.part[0-9]+\.)/gi.test(document.querySelector(".file-title").innerHTML)){
var r =document.querySelector('.file-title').innerHTML+=' ➔ 📚 '
}else{
document.title=document.title.replace(f,'')/*←change le titre de l'onglet*/
var t=document.querySelector('.file-title')/*                                                                                          ⎱ change le titre dans la page      */
t.innerHTML+=' ➔<br><div style="color:#59d3dc!important">'+t.innerHTML.replace(/\([0-9]+.[0-9]+.[A-Z]+\)/g,'').replace(f,'')+'</div>'/*⎰ et ajouter de la couleur au text  */
var h=document.querySelector("[href*='/dl/']")/*    ⎱ sélectionne        */
var a=h.href.split(/([^\/]*)\/*$/)[0]/*              ⎱début url          */
var b=h.href.split(/([^\/]*)\/*$/)[1].replace(f,'')/*⎰fin url avec modif */
var c=h.href=a+b/*                                  ⎰tout l'url modifier */
}