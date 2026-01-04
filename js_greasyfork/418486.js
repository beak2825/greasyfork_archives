// ==UserScript==
// @name         阿里maven复制为XML
// @namespace    https://maven.aliyun.com/mvn/search
// @version      0.1
// @description  单击每行自动格式化复制
// @author       ctry 307680673
// @match        https://maven.aliyun.com/mvn/search
// @grant        none
// @require    https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js

// @downloadURL https://update.greasyfork.org/scripts/418486/%E9%98%BF%E9%87%8Cmaven%E5%A4%8D%E5%88%B6%E4%B8%BAXML.user.js
// @updateURL https://update.greasyfork.org/scripts/418486/%E9%98%BF%E9%87%8Cmaven%E5%A4%8D%E5%88%B6%E4%B8%BAXML.meta.js
// ==/UserScript==

(function() {
    
    // Your code here...
    //$(".last").prepend('<button  type="button">复制</button>')

 new ClipboardJS('.next-table-row', {
			    text: function(trigger) {

                     var list =  $(trigger).children()
        console.log(list[1])
                    var template = `
        <dependency>
            <groupId>${list[2].innerText}</groupId>
            <artifactId>${list[3].innerText}</artifactId>
            <version>${list[4].innerText}</version>
        </dependency>`
			        return template
			    }
			});






})();

