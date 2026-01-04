// ==UserScript==

// @name        Tools UEO 蓝湖 填充密码
// @description 填充密码
// @match       https://lanhuapp.com/web/
// @author      AD
// @version     0.1
// @namespace   aboutdev
// @icon        data:image/png;base64,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

// @downloadURL https://update.greasyfork.org/scripts/433172/Tools%20UEO%20%E8%93%9D%E6%B9%96%20%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/433172/Tools%20UEO%20%E8%93%9D%E6%B9%96%20%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function process(){
        //let str = 'https://lanhuapp.com/web/#/item/project/door?tid=a100397e-5937-4298-b168-bef0c58d6387&pid=62e989e2-ad00-4331-ba30-7b94b9576400&versionId=380d060a-a562-4ea2-83ec-aa017cabed4a&docId=8fa9b136-1099-4b37-9ab2-8ff56cad18b7&docType=axure&pageId=c89995acac2d48dfa06b489417018ddd&image_id=8fa9b136-1099-4b37-9ab2-8ff56cad18b7&type=share_board&teamId=a100397e-5937-4298-b168-bef0c58d6387&userId=b17f18f4-74bd-4f6a-b2cd-f7eb7cd3e294&activeSectionId=&parentId=dc64824517304bab9ce72c166b078300&toName=product'
        //if(document.URL==str)
        {
            document.querySelector('#project-door > div > div > div > ul > li > input[type=text]').value ='NDYs'
            document.querySelector('#project-door > div > div > button').click()
        }
    }
    window.setTimeout(function() {
       process()
    },1000);
})();