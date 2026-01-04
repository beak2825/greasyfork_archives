// ==UserScript==
// @name         bgm_wiki_条目角色关联页面内角色名字汉化
// @namespace    chitanda
// @version      0.11
// @description  角色关联页面内角色名字汉化
// @author       chitanda
// @match        https://bgm.tv/subject/*/add_related/character
// @match        https://bangumi.tv/subject/*/add_related/character
// @match        https://chii.in/subject/*/add_related/character


// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js


// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/412504/bgm_wiki_%E6%9D%A1%E7%9B%AE%E8%A7%92%E8%89%B2%E5%85%B3%E8%81%94%E9%A1%B5%E9%9D%A2%E5%86%85%E8%A7%92%E8%89%B2%E5%90%8D%E5%AD%97%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/412504/bgm_wiki_%E6%9D%A1%E7%9B%AE%E8%A7%92%E8%89%B2%E5%85%B3%E8%81%94%E9%A1%B5%E9%9D%A2%E5%86%85%E8%A7%92%E8%89%B2%E5%90%8D%E5%AD%97%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==





(function() {
    'use strict';
    //获取url的html内容
    async function getResBody(url, ua) {
        let res = await get(url, undefined, ua);
        let body;
        if (res) {
            body = res.responseText;
            return body
        } else {
            console.error(`链接${url}返回40x，无法正常访问`)
        }
    }

    async function baseGet(url, type, ua) {
        if (!type) {
            type = 'document'
        };
        if (ua) {
            ua = "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36''Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36";
        } else {
            ua = undefined;
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: url,
                headers: {
                    'User-Agent': ua,
                    'Referer': url
                },
                responseType: type,
                onload: function(res) {
                    if (res.status == 200) {
                        // console.log(res)
                        return resolve(res)
                    } else if (res.status.toString().startsWith('50')) {
                        reject(res);

                    } else {
                        // console.log('ret')
                        resolve(res);
                        return false;
                    }
                }
            })
        })
    }

    async function get(url, type, ua) {
        return baseGet(url, type, ua).catch(function(err) {
            // console.log(err)
            if (err) {
                return get(url, type, ua)
            }
        })
    }


let charas=$('#columnCrtRelatedA ul#crtRelateSubjects  li.old');

    (async () => {
      let subid=window.location.href.match(/\d+/g)[0];
      let url=`https://bgm.tv/subject/${subid}/characters`;
      let charaPage=await getResBody(url);
        for(let i=0;i<charas.length;i++){
          let chara=charas.eq(i).find('.title');
          let charaName=chara.text().trim();
          let chsName=$(charaPage).find(`h2:contains(${charaName})`).find('span.tip').text().replace('/','').trim();
          if(chsName){
            chara.find('a').text(chsName);
          }

        }
    })()



})();