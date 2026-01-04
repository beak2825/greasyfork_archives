// ==UserScript==
// @name         chp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://lovelive.tools/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414171/chp.user.js
// @updateURL https://update.greasyfork.org/scripts/414171/chp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var meta=document.createElement("meta");
    meta.name="Content-Security-Policy";
    meta.content="upgrade-insecure-requests";
    document.getElementsByTagName('head')[0].appendChild(meta);

    var script=document.createElement("script");
    script.type="text/javascript";
    script.src="https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);


    setTimeout(function(){
        console.log('jq init')

        var addCount = 0;//累计添加条数
        var uuids = [];//已存在的uuids
        $.ajax({
            url:"http://ztd.com/api.php?m=ids",
            type:'get',
            dataType: "json",
            async:false,
            success:function(d){
                uuids=d;
            }
        })
        // console.log(uuids)
        // return false;

        //拉取20条数据
        $.ajax({
            url:"https://api.lovelive.tools/api/SweetNothings/WebSite/10",
            type:'get',
            dataType: "json",
            success:function(d){
                for(var i=0;i<d.length;i++){
                    var p = d[i];
                    if($.inArray(p['id'], uuids)){
                    }else{
                        $.ajax({
                            url:"http://ztd.com/api.php?m=add",
                            type:'get',
                            dataType: "json",
                            data:{
                                id:p['id'],
                                p:p['content'],
                                like:p['likeCount'],
                                dis:p['dislikeCount']
                            },success:function(dd){
                                console.log(dd)
                                if(dd == true){
                                    uuids.push(p['id'])
                                }
                            }
                        })
                    }
                }
            }
        })
    },3000);


})();