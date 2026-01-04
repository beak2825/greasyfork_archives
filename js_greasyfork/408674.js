// ==UserScript==
// @name         Open GitHub jupyter in Colab
// @name:zh-CN   在Colab中打开GitHub Jupyter
// @namespace    https://github.com/windingwind/Open-GitHub-Jupyter-in-Colab
// @version      0.1
// @description  Add a Colab link for GitHub .ipynb file
// @description:zh-CN  在GitHub .ipynb 添加Colab链接
// @author       winding
// @include      *://github.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @supportURL   https://github.com/windingwind/Open-GitHub-Jupyter-in-Colab/blob/master/README.md
// @downloadURL https://update.greasyfork.org/scripts/408674/Open%20GitHub%20jupyter%20in%20Colab.user.js
// @updateURL https://update.greasyfork.org/scripts/408674/Open%20GitHub%20jupyter%20in%20Colab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addColabBtn(){
        const r = new RegExp(/https?:\/\/github.com[^/]*\//g);
        let link = window.location.href;
        $('.Box-header').children('.text-mono').next().prepend('<button id="BtnColab" class="btn btn-sm" style="background-color: #ff9800; margin-right: 5px;">Open in Colab</button>');
        $('#BtnColab').click(function(){
            window.open(link.replace(r, 'https://colab.research.google.com/github/'));
        });
    }
    function addFileListBtn() {
        $('[aria-labelledby="files"]').find('[role="rowheader"]').each(function(i,e){
            try{
                let file = $(e).find('a').text();
                if(file.indexOf('.ipynb')>=0){
                    let link = 'https://colab.research.google.com/github'+$(e).find('a').attr("href");
                    $(e).before(`<a role='gridcell' id='FileListBtnColab' href=${link} target="_blank" style='margin: 0 5px 0 5px;'>
                             <img height='25px' src='https://raw.githubusercontent.com/windingwind/Open-GitHub-Jupyter-in-Colab/master/colab.png'/>
                             </a>`);
                }
            }
            catch(e){
                console.warn(e);
            }
        })
    }
    function checkColabBtn(){
        if($('#BtnColab').length == 0){
            addColabBtn();
        }
        if($('#FileListBtnColab').length == 0){
            addFileListBtn();
        }
    }
    function main(){
        addColabBtn();
        addFileListBtn();
        setInterval(checkColabBtn, 1500);
    }
    main();
})();
