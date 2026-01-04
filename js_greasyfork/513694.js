// ==UserScript==
// @name         XJTU ispace hack
// @namespace    http://hack.xjtu.edu.cn/
// @version      0.4.2
// @description  使XJTU思源学习空间所有课件可下载
// @author       Noan
// @match        https://ispace.xjtu.edu.cn/*
// @match        http://ispace.xjtu.edu.cn/*
// @match        https://v-ispace.xjtu.edu.cn:*/*
// @match        http://v-ispace.xjtu.edu.cn:*/*
// @match        https://class.xjtu.edu.cn/*
// @match        http://class.xjtu.edu.cn/*
// @match        https://v-class.xjtu.edu.cn:*/*
// @match        http://v-class.xjtu.edu.cn:*/*
// @icon         https://ispace.xjtu.edu.cn/static/assets/images/favicon-b420ac72.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/513694/XJTU%20ispace%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/513694/XJTU%20ispace%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let original_XHR = window.XMLHttpRequest;

    class XMLHttpRequestHijacked extends original_XHR
    {
        override=false;
        hijack=false;
        type=-1;
        new_val={};
        set response(new_val)
        {
            this.override=true;
            this.new_val=new_val;
        }
        get response()
        {
            if(this.override)
            {
                return this.new_val;
            }
            else if(this.hijack)
            {
                if(this.type==0)
                {
                    let res=JSON.parse(super.response);
                    if(!("uploads" in res))
                    {
                        return super.response;
                    }
                    for(let i=0;i< res.uploads.length;i++)
                    {
                        if("allow_download"in res.uploads[i])
                        {
                            res.uploads[i].allow_download=true;
                        }
                    }
                    return JSON.stringify(res);
                }
                else if(this.type==1)
                {
                    let res=JSON.parse(super.response);
                    if(!("data" in res))
                    {
                        return super.response;
                    }
                    if("can_download"in res.data)
                    {
                        res.data.can_download=true;
                    }

                    return JSON.stringify(res);
                }
                else
                {
                    return super.response;
                }


            }
            else
            {
                return super.response;
            }
        }
        get responseText()
        {
            if(this.override || this.hijack)
            {
                return this.response;
            }
            else
            {
                return super.responseText;
            }

        }
        open(method, url, async=true, username, password)
        {
            if(url.search("api/activities")!=-1)
            {
                this.hijack=true;
                this.type=0;
            }
            else if(url.search("permissions")!=-1)
            {
                this.hijack=true;
                this.type=1;
            }
            let rescnt = super.open(method, url, async=true, username, password);
            return rescnt;
        }
    }

    window.XMLHttpRequest = XMLHttpRequestHijacked;
})();