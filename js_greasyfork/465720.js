// ==UserScript==
// @name         Saving-Loading Danbooru Upload Tags
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Load saved tags from unposted uploads
// @author       You
// @match        https://danbooru.donmai.us/uploads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465720/Saving-Loading%20Danbooru%20Upload%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/465720/Saving-Loading%20Danbooru%20Upload%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var yooyookocopytagblock = document.createElement('span');
    yooyookocopytagblock.textContent = '|Save tag notations to data.json|  ';
    yooyookocopytagblock.id="yooyooko-copytagblock";

    var yooyookosavefile = document.createElement('span');
    yooyookosavefile.textContent="|Save JSON file|";
    document.getElementById('subnav-menu').appendChild(yooyookocopytagblock);
    document.getElementById('subnav-menu').appendChild(yooyookosavefile);
    color_clicklbl(yooyookocopytagblock,'gray')

    /*
    IMPORTANT: YOU MUST READ THIS IF YOU WANT TO USE THIS SCRIPT PROPERLY!!!
    You need to start a local web server in the directory where your saved tags json file is located that can take GET requests and that sets Danbooru as an allowed domain in the CORS origin options.
    Here's an example that works:

    http-server -p 3000 --cors --cors-headers="Content-Type, Accept, Range" --cors-origin="https://danbooru.donmai.us"

    http-server is a node.js module, that can be easily installed with 'npm install http-server -g' if you have node.js installed. You should be able to do this on all platforms and OSes that support node.js.
    Afterwards you need to specify the filename where you want to keep your saved tags.
    You also need to create an empty JSON file with a filename you wanna use.
    */

    var filenm="fetchfile.php";
    var drctry="https://myfileshosted.000webhostapp.com/";

    var upscrp=drctry+"updatefile.php";
    var svdfle=drctry+filenm+"?" + new Date().getTime();

    function savetextfile(content,filenamexx) {
        // Create element with <a> tag
        const link = document.createElement("a");
        const file = new Blob([content], { type: 'application/json' });
        link.href = URL.createObjectURL(file);
        link.download = filenamexx;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function savetextfileonline(updatedContent) {
        const url = upscrp;
        fetch(url, {
            method: 'POST',
            body: new URLSearchParams({
                updatedContent: updatedContent
            })
        })
            .then(response => {
            if (response.ok) {
                console.log('Text file updated successfully.');
                color_clicklbl(yooyookocopytagblock,'green')
            } else {
                console.error('Error updating text file:', response.status);
                color_clicklbl(yooyookocopytagblock,'red')
            }
        })
            .catch(error => {
            console.error('Error:', error);
            color_clicklbl(yooyookocopytagblock,'red')
        });
    }

    function color_clicklbl(yooyookocopytagblock,col)
    {
        yooyookocopytagblock.style.color=col;
    }

    function readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    //console.log(rawFile.responseText)
                }
            }
        }
        rawFile.send(null);
        return rawFile.responseText;
    }




    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
            console.log(`Copied "${text}" to the clipboard`);
        })
            .catch((error) => {
            console.error(`Failed to copy "${text}" to the clipboard: ${error}`);
        });
    }


    function findNthOccurrence(str, char, n) {
        let count = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === char) {
                count++;
                if (count === n) {
                    return i;
                }
            }
        }
        return -1;
    }

    function update_tagdb(uplodtags,currid)
    {
        var reeta=0;
        uplodtags.forEach((itemix) => {
            if(itemix.id==currid)
            {
                itemix.tags=document.getElementById('post_tag_string').value;
                itemix.sourceurl=document.getElementById('post_source').value;

                if(document.getElementsByClassName('radio_buttons')[2].checked==true)
                {
                    itemix.rating=0;
                }
                else if(document.getElementsByClassName('radio_buttons')[3].checked==true)
                {
                    itemix.rating=1;
                }
                else if(document.getElementsByClassName('radio_buttons')[4].checked==true)
                {
                    itemix.rating=2;
                }
                else if(document.getElementsByClassName('radio_buttons')[5].checked==true)
                {
                    itemix.rating=3;
                }
                else
                {
                    alert('Rating not selected.')
                    console.log('rating not selected lul;');
                    reeta=1;
                    return 0;
                }
                reeta=1;
                console.log('found existing post!')
                return 0;
            }
        });

        if(reeta==1)
        {
            savetextfileonline(JSON.stringify(uplodtags,null, 2));
            return 0;
        }

        var itemix={"id":currid,"tags":document.getElementById('post_tag_string').value,"sourceurl":document.getElementById('post_source').value,"rating":0};
        if(document.getElementsByClassName('radio_buttons')[2].checked==true)
        {
            itemix.rating=0;
        }
        else if(document.getElementsByClassName('radio_buttons')[3].checked==true)
        {
            itemix.rating=1;
        }
        else if(document.getElementsByClassName('radio_buttons')[4].checked==true)
        {
            itemix.rating=2;
        }
        else if(document.getElementsByClassName('radio_buttons')[5].checked==true)
        {
            itemix.rating=3;
        }
        else
        {
            alert('Rating not selected.')
            reeta=1;
            console.log('rating not selected lul;')
            return 0;
        }
        if(reeta==1)
        {
            return 0;
        }
        uplodtags.push(itemix);
        savetextfileonline(JSON.stringify(uplodtags,null, 2));
        return 1;
    }

    yooyookocopytagblock.addEventListener('click', function() {
        update_tagdb(upload_tags,window.location.href.substr(findNthOccurrence(window.location.href,'/',4)).substr(1).replaceAll('#',''));
    });

    yooyookosavefile.addEventListener('click', function() {
        update_tagdb(upload_tags,window.location.href.substr(findNthOccurrence(window.location.href,'/',4)).substr(1).replaceAll('#',''));
        savetextfile(JSON.stringify(upload_tags,null, 2),"file.json");
    });

    color_clicklbl(yooyookocopytagblock,'white')

    document.getElementsByClassName('tab-panels')[0].addEventListener('click', function() {
        color_clicklbl(yooyookocopytagblock,'white')
    });


    //savetextfile(JSON.stringify(upload_tags));
    //console.log(readTextFile(svdfle))

    var upload_tags=JSON.parse(readTextFile(svdfle));
    console.log(upload_tags);


    /*

        {
            "id":"xxxxxxxx",
            "tags":"00",
            "sourceurl":"https://twitter.com/Simonsuke/status/",
            "rating":0,
        },

        {
            "id":"xxxxxxxxx",
            "tags":"damare",
            "rating":0,
        },
*/
    const currentupldurl = window.location.href;

    upload_tags.forEach(item=>{
        if(currentupldurl.includes(item.id))
        {
            console.log(item.tags);
            document.getElementById('post_tag_string').value=item.tags;
            if(typeof item.sourceurl !== "undefined")
            {
                document.getElementById('post_source').value=item.sourceurl;
            }
            if(typeof item.rating !== "undefined")
            {
                document.getElementsByClassName("collection_radio_buttons")[item.rating].click()
            }
        }
    })
})();