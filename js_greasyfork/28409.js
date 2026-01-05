// ==UserScript==
// @name         GitHub FileSize Viewer
// @namespace    http://tampermonkey.net/
// @version      0.9.12
// @description  Show the file size next to it on the website
// @author       nmaxcom
// @match        https://*.github.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28409/GitHub%20FileSize%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/28409/GitHub%20FileSize%20Viewer.meta.js
// ==/UserScript==

// TODO: try document.addEventListener("pjax:start", function(){...}) and pjax:end as triggers
(function(){
    /****************
     * Options:
     ****************/
    const DEBUG_MODE = true; // in production mode should be false
    const SHOW_BYTES = false; // false: always KB, i.e. '>1 KB', true: i.e. '180 B' when less than 1 KB
    /****************/

    var textColor = '#6a737d'; // Default github style
    // var textColor = '#888'; // my dark github style
    createStyles();

    var origXHROpen               = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        this.addEventListener('loadend', function(){
            if(DEBUG_MODE) console.log('%cStart: ' + document.title, 'color:white;background-color:#20A6E8;padding:3px');
            tableCheckandGo();
        });
        origXHROpen.apply(this, arguments);
    };

    var vars = {}, response;
    tableCheckandGo();


    /**
     * Order of business:
     * - Detect table, if present, launch async API call and insert new blank cells
     * - Detect necessary info to make the async API call
     * - When promised is successful, change the blanks for the numbers
     * done: detect page change since github does that youtube thing
     */

    function tableCheckandGo(){
        if(document.querySelector('table.files')){
            if(setVars()){
                var callPromise = callGitHub();
                callPromise
                    .then(function(resp){
                        response = resp;
                        if(DEBUG_MODE) console.info('GitHub call went through');
                        if(DEBUG_MODE) console.info(resp.responseText);
                        insertBlankCells();
                        fillTheBlanks(JSON.parse(resp.responseText));
                        recheckAndFix();
                    })
                    .catch(function(fail){
                        if(DEBUG_MODE) console.error(fail);
                    });
            } else {
                if(DEBUG_MODE) console.info('setVars() failed. Vars: ', vars);
            }
        } else {
            if(DEBUG_MODE) console.info('No data table detected, nothing to do');
        }
    }

    /**
     * API call
     */
    function callGitHub(){
        return new Promise(function(resolve, reject){
            // I'm forced to use GM_xmlhttpRequest to avoid Same Origin Policy issues
            GM_xmlhttpRequest({
                method : "GET",
                url    : getAPIurl(),
                onload : function(res){
                    resolve(res);
                },
                onerror: function(res){
                    reject(res);
                }
            });
        });
    }

    function getAPIurl(){
        // .../repos/:owner/:repo/contents/:path?ref=branch
        vars.dir = vars.dir || '';
        return "https://api.github.com/repos/" +
            vars.owner + "/" +
            vars.repo +
            "/contents/" +
            vars.dir + "?ref=" + vars.branch;
    }

    /**
     * - Directories get new cellmate too
     *
     */
    function insertBlankCells(){
        var filenameCells = document.querySelectorAll('tr[class~="js-navigation-item"] > td.content');
        for(var i = 0, len = filenameCells.length; i < len; i++){
            var newtd       = document.createElement('td');
            newtd.className = 'filesize';
            filenameCells[i].parentNode.insertBefore(newtd, filenameCells[i].nextSibling);
        }
        if(DEBUG_MODE) console.info(`Inserted ${i} cells`);
    }

    /**
     * If we get the data, we insert it carefully so each filename gets matched
     * with the correct filesize.
     */
    function fillTheBlanks(JSONelements){
        if(!document.querySelectorAll('td.filesize').length){
            debugger;
        }
        var nametds = document.querySelectorAll('tr[class~="js-navigation-item"] > td.content a');
        var i, len;
        toploop:
            for(i = 0, len = JSONelements.length; i < len; i++){
                for(var cellnum in nametds){
                    if(nametds.hasOwnProperty(cellnum) && JSONelements[i].name === nametds[cellnum].innerHTML){
                        if(JSONelements[i].type === 'file'){
                            var sizeNumber = (JSONelements[i].size / 1024).toFixed(0);
                            if(SHOW_BYTES){
                                sizeNumber = sizeNumber < 1 ? JSONelements[i].size + ' B' : sizeNumber + ' KB';
                            } else {
                                sizeNumber = sizeNumber < 1 ? '> 1 KB' : sizeNumber + ' KB';
                            }
                            nametds[cellnum].parentNode.parentNode.nextSibling.innerHTML = sizeNumber;
                        }
                        continue toploop;
                    }
                }
            }
        if(DEBUG_MODE) console.info(`Processed ${i} of ${len} elements`);
        // if(DEBUG_MODE) console.info('Dumping json y nodes:');
        // if(DEBUG_MODE) console.log(JSONelements.forEach(function(e,i){if(DEBUG_MODE) console.log(JSONelements[i].name)}));
        // if(DEBUG_MODE) console.log(nametds.forEach(function(e,i){if(DEBUG_MODE) console.log(nametds[i].innerHTML)}));


    }

    function createStyles(){
        var css   = 'td.filesize { color: ' + textColor + ';' +
                'text-align: right;' +
                'padding-right: 50px !important; }' +
                'table.files td.message { max-width: 250px !important;',
            head  = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if(style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    }


    /**
     * Hay que satisfacer en la api el GET /repos/:owner/:repo/contents/:path?ref=branch
     * Con este regex capturamos del título  \w+(.*?)\sat\s(.*?)\s.*?(\w+)\/(\w+)
     * 1) dir path, 2) branch, 3) owner, 4) repo
     * Ese regex no funciona en el root
     */
    function setVars(){
        var title  = document.title;
        // Root folder:
        var match3 = title.match(/.*?([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+):/);
        // Non root folder, any branch:
        //var match1 = title.match(/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)\sat\s([a-zA-Z0-9._-]+)\s·\s([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/);
        // Root folder, we'll extract branch from scrape
        var match2 = title.match(/.+?\/([a-zA-Z0-9._\/-]+).*?·\s([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._\/-]+)/);
        if(match3){
            vars        = {owner: match3[1], repo: match3[2]};
            vars.branch = document.querySelector('.branch-select-menu button span').innerHTML;
        }/*else if(match1) {
         vars = {repo: match1[1], dir: match1[2], branch: match1[3], owner: match1[4]};
         } */ else if(match2){
            vars        = {dir: match2[1], owner: match2[2], repo: match2[3]};
            vars.branch = document.querySelector('.branch-select-menu button span').innerHTML;
        } else if(DEBUG_MODE) console.log(getAPIurl());
        return 1;
    }

    /**
     * Sometimes, even though data has been correctly recieved, the DOM doesn't play well
     * for whatever reason. This function will quickly check if the data is indeed
     * there and if it's not will repaint the data again with the original functions.
     * TODO: finish this part
     */
    function recheckAndFix(){
        // Count td.filesize and compare to total rows
        let filesizes = document.querySelectorAll('td.filesize').length;
        let ages      = document.querySelectorAll('td.age').length;
        if(filesizes === ages){
            if(DEBUG_MODE) console.info(`Good empty check: ${filesizes} of ${ages}`);
        } else {
            if(DEBUG_MODE) console.info(`Bad empty check: ${filesizes} of ${ages}. Repainting`);

        }
        // Count non-empty td.filesize and compare to number of files from response

        if(DEBUG_MODE) console.info(`Say something...`);
    }
})();
