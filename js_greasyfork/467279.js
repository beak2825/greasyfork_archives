// ==UserScript==
// @name         Block Site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽网站，清静下来，省时间，省生命
// @author       You
// @match        *:*
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require https://cdn.staticfile.org/vue/2.6.14/vue.min.js
// @require https://lib.baomitu.com/vue/2.6.14/vue.min.js
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require https://unpkg.com/element-ui/lib/index.js
// @resource elementStyle https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText

// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @grant    GM_addStyle
// @grant    GM_getResourceURL
// @grant    GM_listValues
// @grant    GM.getResourceUrl
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @grant    GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/467279/Block%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/467279/Block%20Site.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // 代码内部    引入bootstrap的css文件并加入html中
   const css = GM_getResourceText("elementStyle");
   GM_addStyle(css);
console.log('a')
    if(location.href=='http://vin.kbug.cn/block.html'){
        let gg = GM_getValue("pre_url")
        $("body").html(`
            <div style='display: flex;justify-content: center;margin-top:calc(30vh);'>
        <div style="display: flex;flex-direction: column;">
            <div style="font-size:40px;">
                敢不敢，事上练
            </div>
            <div style='margin:10px 0;font-size:20px;color: green;'>选项: 练字、编程、Emacs、英语</div>
            <div>正在访问URL: <a href="${gg?gg:''}">${gg?gg:''}</a></div>
        </div>
    </div>
    `)
    }
    if(location.href=="http://vin.kbug.cn/blocksite.html")
    {
        $("body").html(`
            <div id="app">
        <h3 >BlockSite</h3>
        <div >
            <el-input v-model="url" style="width:200px;" placeholder="请输入主域名匹配符"></el-input>
            <el-button @click="addUrl">添加</el-button>
        </div>
        <div>
            <h3>
            Block WebSite Pattern
            </h3>
            <p>只需要添加主域名即可, xxx.com</p>
            <table>
                <tr>
                    <th>URL</th>
                    <th>操作</th>
                </tr>
                <tr  v-for="(u,i) in urlList" :key="i">
                    <td >
                        {{u}}
                    </td>
                    <td><el-link @click="removeUrl(u)">删除</el-link></td>
                </tr>
            </table>
            <p></p>
        </div>
        </div>
        `)
        document.title="BlockSite"

        new Vue({
            el:"#app",
            data:{
                resdata:{},
                url:'',
                urlList:new Set(),
            },
            mounted(){
                if(GM_getValue("url")){
                    this.urlList = new Set([...GM_getValue("url")])
                }else {
                    GM_setValue("url",[])
                }
            },
            methods:{
                 addUrl(){
                        this.urlList.add(this.url)
                        GM_setValue("url",[...this.urlList])
                        this.urlList = new Set([...this.urlList]);
                        this.url = ''
                 },
                 removeUrl(url){
                        this.urlList.delete(url)
                        GM_setValue("url",[...this.urlList])
                        this.urlList = new Set([...this.urlList]);
                 }
            }
        })
    }else {
        const urlList = GM_getValue("url");
        urlList.forEach(url=>{
            if(new RegExp(`^http.*${url}.*`).test(location.href)){
                location.href='http://vin.kbug.cn/block.html'
                GM_setValue("pre_url",location.href)
                console.log("已被禁止")
            }
        })

    }

})();