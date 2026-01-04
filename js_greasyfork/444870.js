// ==UserScript==
// @name         render环境变量导出（Render Env Export）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  export env data from render
// @author       ZongZheng
// @match        https://dashboard.render.com/*/env
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444870/render%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%AF%BC%E5%87%BA%EF%BC%88Render%20Env%20Export%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444870/render%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%AF%BC%E5%87%BA%EF%BC%88Render%20Env%20Export%EF%BC%89.meta.js
// ==/UserScript==

(function() {

    async function exportRenderData () {
        const token = JSON.parse(window.localStorage.getItem('render-auth')).idToken
        console.log('token', token)
       const body = {"operationName":"envVarsForService","variables":{"serviceId":"srv-c3illas7o9q4fj24q7b0","isFile":false},"query":"query envVarsForService($serviceId: String!, $isFile: Boolean!) {\n  envVarsForService(serviceId: $serviceId, isFile: $isFile) {\n    ...envVarFields\n    __typename\n  }\n}\n\nfragment envVarFields on EnvVar {\n  id\n  isFile\n  key\n  value\n  __typename\n}\n"}
       const res = await fetch("https://api.render.com/graphql",{
          method: "post",
           body: JSON.stringify(body),
           credentials: 'include',
           headers: {
             "Authorization": "Bearer " + token,
               "Content-Type": "application/json"
           }
       })
       const data = await res.json()
       console.log(data.data.envVarsForService.map(item => `${item.key}=${item.value}`).join('\n'))
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function () {
       eval(this.responseText)
       exportRenderData()
    });
    oReq.open("GET", "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js");
    oReq.send();
    //# sourceMappingURL=jquery.slim.min.map
    // Your code here...


})();