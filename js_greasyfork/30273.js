// ==UserScript==
// @name zfilm-hd Комментарии пользователей zFilm-HD
// @namespace zfilm-hd.club Комментарии пользователей
// @grant boOk1
// @description:ru Специально для фанатов портала Zfilm-HD. Отображении ссылки на комментарии пользователя.
// @compatible   chrome Only with Tampermonkey or Violentmonkey. Только с Tampermonkey или Violentmonkey.
// @require https://code.jquery.com/jquery-3.6.0.slim.min.js
// @match *://*/*
// @version 0.2.7.02122022
// @description Специально для фанатов портала Zfilm-HD. Отображении ссылки на комментарии пользователя с целью просмотреть их увлечения.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/30273/zfilm-hd%20%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%20zFilm-HD.user.js
// @updateURL https://update.greasyfork.org/scripts/30273/zfilm-hd%20%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D0%B5%D0%B9%20zFilm-HD.meta.js
// ==/UserScript==

let domains = [false,false];
let domain = '';
try{ domains[0] = location.hostname; } catch(e1){ try{ domains[1] = document.domain; } catch(e2){console.error('I am sorry, domain is undefined');} }
if(domains[0]) { domain = domains[0]; } else { domain = domains[1]; }
if(domain.length > 0){
    let header = $('head').first();
    let checkUrls = ['link[rel="search"]','meta[property="og:site_name"]'];
    let target = false;
    for (let i = 0; i < checkUrls.length; ++i) {
        let obj = header.find(checkUrls[0]);
        if(obj.length > 0){
            if(obj.attr('title').indexOf('zFilm-HD') > -1){
                target = true;
                break;
            }
        }
    }
    if(target){
        try{
        $('div.zcomm-ava img').each(function(){
            var DDid = $(this).attr("src");
            if(DDid != "/templates/Default/dleimages/noavatar.png"){
                let uid = DDid.replace('/uploads/fotos/foto_', '').replace('http://', '').replace('https://', '').replace(domain, '').replace('.jpg', '').replace('.jpeg', '').replace('.png', '');
                $(this).after('<a class="zcomm-quoteuser" href="https://' + domain + '/index.php?do=lastcomments&userid=' + uid + '" target="_blank">Коммент.</a>');
            }
        });
        }catch(e){
            console.error('zFilmd HD cant work');
        }
    }
}