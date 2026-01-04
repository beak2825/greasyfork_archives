// ==UserScript==
// @name         CollectMissingSrc
// @namespace    http://gitbay.net/
// @version      0.1
// @description  收集console的error数据!
// @author       Emery
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377489/CollectMissingSrc.user.js
// @updateURL https://update.greasyfork.org/scripts/377489/CollectMissingSrc.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function getMissingSrc(tagMap,resources_list){
        var tagName = tagMap.tagName;
        var tagSrc = tagMap.tagSrc;

        var results = [];

        var els = document.getElementsByTagName(tagName)
        for(var i=0;i<els.length;i++){
            var a= els[i];
            var src = a[tagSrc];
            if( src && src.length >10 ){
                if(resources_list[ src]){
                    continue;
                }
                results.push(src);
                //console.log( '发现加载错误',i, src, a);
            }
        }
        return results;
    }



    function collectMissingSrcAsset(){
        // 收集已经加载的资源
        var resources = performance.getEntriesByType("resource");
        var resources_list ={};
        for(var i = 0;i < resources.length;i++){
            var r =resources[i];
            resources_list[ r.name ] = r.initiatorType ;
            //console.log(i,r.initiatorType ,r.name,r)
        }

        var tagsMap = [{'tagName': 'img' , 'tagSrc': 'src'},
                       {'tagName': 'script' , 'tagSrc': 'src'},
                       {'tagName': 'link' , 'tagSrc': 'href'},

                       {'tagName': 'source' , 'tagSrc': 'src'},
                       {'tagName': 'video' , 'tagSrc': 'src'},
                       {'tagName': 'xml' , 'tagSrc': 'src'},
                       {'tagName': 'embed' , 'tagSrc': 'src'}
                      ];
        //  <source src="test.mp3" type="audio/mpeg">
        // <video src="rabbit320.webm" controls>
        // <xml id="note" src="note.xml">
        // <embed src="helloworld.swf">
        var resultList=[];
        for( var j = 0;j<tagsMap.length ; j++){
            var tagMap = tagsMap[j];
            var results =getMissingSrc(tagMap,resources_list);
            if( results.length >0){
                resultList = resultList.concat(results);
            }
        }
        return resultList;
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function saveArrayToFile(){
        window.MissingList = collectMissingSrcAsset();//重新计算，因为有可能增加了

        var text = window.MissingList.join('\n');
        var d = new Date();
        var timeStr =d.toLocaleString()
        var filename= document.title +'-MissingSrc'+timeStr+'.txt';
        filename = filename.replace(/\ /g,"-"); // 替换空格
        download(filename, text);
    }
    window.saveArrayToFile = saveArrayToFile;

    function main(){
        window.MissingList = collectMissingSrcAsset();
        if( window.MissingList.length >0 ){
            console.log('当前有', window.MissingList.length,'个文件未加载成功');
            console.log('详情请输入 window.MissingList ');
            console.log('如果要下载成txt，请输入 saveArrayToFile()');
        }else{
            console.log('当前文件加载正常');
        }
    }

    main();


    // Your code here...
})();