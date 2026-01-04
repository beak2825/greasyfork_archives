// ==UserScript==
// @name         SignInBottom
// @namespace    https://github.com/0BlueYan0
// @version      1.4.1
// @description  Generate a bottom link.
// @author       0BlueYan0
// @match        https://ilearn.fcu.edu.tw/course/view.php?id=*
// @connect      coursesearch03.fcu.edu.tw
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @inject-into  content
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512116/SignInBottom.user.js
// @updateURL https://update.greasyfork.org/scripts/512116/SignInBottom.meta.js
// ==/UserScript==

(function() {
    let headers = {
        "Accept": "*/*",
        "Accept-Language": 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6',
        "DNT": "1",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Content-Type":"application/json; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3573.0 Safari/537.36",
    }
    
    const userAgent = navigator.userAgent;
    let safari = false;
    let currentUrl = window.location.href;

    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
        console.log('使用的是 Safari 瀏覽器');
        safari = true;
        const Link = localStorage.getItem(currentUrl);
        if(Link !== null){
            createBottom(Link);
            console.log("get success")
            return;
        }
    }else {
        const Link = GM_getValue(currentUrl, false);
        if(Link !== false){
            createBottom(Link);
            console.log("get success")
            return;
        }
    }

    const className = document.querySelector('#page-header > div.d-sm-flex.align-items-center > div.mr-auto > div > div > h1');
    let code = className.textContent.substring(className.textContent.length - 5, className.textContent.length - 1);
    let year_sms = className.textContent.split(' ')[0];
    
    let payload = {
        "baseOptions":{
            "lang":"cht",
            "year":year_sms.substring(0,3),
            "sms":year_sms.substring(3)
        },
        "typeOptions":{
            "code":{             // 選課代號
                "enabled":"true",
                "value":code
            },
            "weekPeriod":{
                "enabled":"false",
                "week":"*",      // 星期 */1/2/../7
                "period":"*"     // 節次 */0/1/2/../14
            },
            "course":{           // 科目名稱
                "enabled":"false",
                "value":""
            },
            "teacher":{          // 開課教師姓名
                "enabled":"false",
                "value":""
            },
            "useEnglish":{       // 全英語授課
                "enabled":"false"
            },
            "useLanguage":{      // 授課語言
                "enabled":"false",
                "value":"01"     // 01：中文 02：英語 03：日語 04：德語 05：法語 06：西班牙語 07：其他 08：中英
            },
            "specificSubject":{  // 特定科目
                "enabled":"false",
                "value":"1"      // 1：通識課程 2：體育選項課程 3：大學國文
            },
            "courseDescription":{// 課程描述
                "enabled":"false",
                "value":""
            }
        }
    }
    
    let url = 'https://coursesearch03.fcu.edu.tw/Service/Search.asmx/GetType2Result';
    var cls_id = "", total = 0, sub_id = "", scr_dup = "", sub_id3="";

    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: headers,
        data: JSON.stringify(payload),
        onload: function(response) {
            let data = response.responseText;
            data.replace('\\"','"' );
            data.replace(':"{',': {' );
            data.replace('}]}"}','}]}}');
            const jsonData = JSON.parse(data);
        
            total = jsonData.total;
            cls_id = jsonData.items['0'].cls_id;
        
            if(total > 1){
                cls_id = cls_id.substring(0, cls_id.length - 1) + '9';
            }
        
            sub_id = jsonData.items['0'].sub_id;
            scr_dup = jsonData.items['0'].scr_dup;
            sub_id3 = jsonData.items['0'].sub_id3;
        
            const signInLink = "https://ilearn.fcu.edu.tw/apps/apps_sso.php?course="+ year_sms + cls_id + sub_id + scr_dup + sub_id3 +"&log_app=03D&log_lang=tw&log_block=FCU%E8%AA%B2%E5%8B%99%E5%B7%A5%E5%85%B7&sys_name=%E9%BB%9E%E5%90%8D";
        
            createBottom(signInLink);
            if(safari === false) {
                GM_setValue(currentUrl, signInLink);
            }else {
                localStorage.setItem(currentUrl, signInLink);
            }
            console.log("set success")
        }
    });

    function createBottom(signInLink) {
        const ul = document.querySelector('#inst36323 > div > div > ul');
        
            const li = document.createElement('li');
            li.setAttribute('class', 'r1');
        
            const c1 = document.createElement('div');
            c1.setAttribute('class', 'column c1');
            li.appendChild(c1);
        
            const a = document.createElement('a');
            a.target = '_blank';
            a.href = signInLink;
            c1.appendChild(a);
        
            const i = document.createElement('i');
            i.setAttribute('class', 'icon fa fa-map-marker fa-fw icon');
            i.setAttribute('aria-hidden', 'true');
            a.appendChild(i);
            a.innerHTML += '點名';
        
            const reference = document.querySelector('#inst36323 > div > div > ul > li:nth-child(6)');
        
            ul.insertBefore(li, reference);
    }

    // fetch(url,{
    //     method: 'POST',
    //     headers: headers,
    //     body: JSON.stringify(payload)
    // }).then(response => response.text()).then(data => {
    //     data.replace('\\"','"' );
    //     data.replace(':"{',': {' );
    //     data.replace('}]}"}','}]}}');
    //     const jsonData = JSON.parse(data);
    
    //     total = jsonData.total;
    //     cls_id = jsonData.items['0'].cls_id;
    
    //     if(total > 1){
    //         cls_id = cls_id.substring(0, cls_id.length - 1) + '9';
    //     }
    
    //     sub_id = jsonData.items['0'].sub_id;
    //     scr_dup = jsonData.items['0'].scr_dup;
    //     sub_id3 = jsonData.items['0'].sub_id3;
    
    //     const signInLink = "https://ilearn.fcu.edu.tw/apps/apps_sso.php?course="+ year_sms + cls_id + sub_id + scr_dup + sub_id3 +"&log_app=03D&log_lang=tw&log_block=FCU%E8%AA%B2%E5%8B%99%E5%B7%A5%E5%85%B7&sys_name=%E9%BB%9E%E5%90%8D";
    
    //     const ul = document.querySelector('#inst36323 > div > div > ul');
    
    //     const li = document.createElement('li');
    //     li.classList.add('new-li');
    
    //     const c1 = document.createElement('div');
    //     c1.classList.add('new-column-c1');
    //     li.appendChild(c1);
    
    //     const a = document.createElement('a');
    //     a.target = '_blank';
    //     a.href = signInLink;
    //     c1.appendChild(a);
    
    //     const i = document.createElement('i');
    //     i.setAttribute('class', 'icon fa fa-map-marker fa-fw icon');
    //     i.setAttribute('aria-hidden', 'true');
    //     a.appendChild(i);
    //     a.innerHTML += '點名';
    
    //     const reference = document.querySelector('#inst36323 > div > div > ul > li:nth-child(6)');
    
    //     ul.insertBefore(li, reference);
    // });
    
})();