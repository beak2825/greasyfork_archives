// ==UserScript==
// @name         _C_ DumbBlogSkip
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Skips the dumb blog of the bypass shortlink script
// @author       Shadoweb
// @match        *://*/*
// @exclude      /^(https?:\/\/)(.+)?((advertisingexcel|talkforfitness|rsadnetworkinfo|rsinsuranceinfo|rsfinanceinfo|rssoftwareinfo|rshostinginfo|rseducationinfo|gametechreviewer|vegan4k|phineypet|batmanfactor|techedifier|urlhives|linkhives|github|freeoseocheck|greenenez|aliyun|reddit|bing|yahoo|wiki-topia|edonmanor|vrtier|whatsapp|gearsadviser|edonmanor|tunebug|menrealitycalc|amazon|ebay|payoneer|paypal|skrill|stripe|tipalti|wise|discord|tokopedia|taobao|taboola|aliexpress|netflix|citigroup|spotify|bankofamerica|hsbc|accounts.youtube|(cloud|mail|translate|analytics|accounts|myaccount|contacts|clients6|developers|payments|pay|ogs|safety|wallet).google|(login|signup|account|officeapps|api|mail|hotmail).live|basketballsavvy|kalimbanote).com|(thumb8|thumb9|crewbase|crewus|shinchu|shinbhu|ultraten|uniqueten|topcryptoz|allcryptoz|coinsvalue|cookinguide|cryptowidgets|webfreetools|carstopia|makeupguide|carsmania|nflximg|doubleclick|luckydice).net|(linksfly|shortsfly|urlsfly|wefly|blog24).me|(greasyfork|openuserjs|adarima|telegram|wikipedia).org|mcrypto.club|misterio.ro|insurancegold.in|coinscap.info|chefknives.expert|(shopee|lazada|rakuten|maybank).*|(dana|ovo|bca.co|bri.co|bni.co|bankmandiri.co|desa|(.*).go).id|(.*).(edu|gov))(\/.*)/
// @icon         https://i.ibb.co/qgr0H1n/BASS-Blogger-Pemula.png
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/491000/_C_%20DumbBlogSkip.user.js
// @updateURL https://update.greasyfork.org/scripts/491000/_C_%20DumbBlogSkip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if("free4u.nurul-huda.or.id" == location.hostname){
        location = location.search.replace("?BypassResults=", "");
    }

    let link = "https://menrealitycalc.com/greasyfork";
    let elem = document.querySelector(`iframe[src="${link}"]`);
    if(elem != null) elem.remove();
})();