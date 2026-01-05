// ==UserScript==
// @name        ΞGitHub API TesterΞ
// @namespace   TimidScript
// @description GitHub API Tester. Works from example.com
// @include     http://www.example.com/
// @version     1
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/11060/%CE%9EGitHub%20API%20Tester%CE%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/11060/%CE%9EGitHub%20API%20Tester%CE%9E.meta.js
// ==/UserScript==

var username = "", password = "", token = "", tokenid = "", gistid = "";

//https://developer.github.com/v3/oauth/#scopes         //Scopes
//https://developer.github.com/v3/gists/#edit-a-gist    //Gists
//https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app


/*
You can use Basic Authentication to have full API access but
it causes security issues
*/

function UpdateStoredValues()
{
    GM_setValue("username", document.getElementById("username").value);
    GM_setValue("password", document.getElementById("password").value);
    GM_setValue("token", document.getElementById("token").value);
    GM_setValue("tokenid", document.getElementById("tokenid").value);
    GM_setValue("gistid", document.getElementById("gistid").value);

    username = GM_getValue("username");
    //password = GM_getValue("password");
    token = GM_getValue("token");
    tokenid = GM_getValue("tokenid");
    gistid = GM_getValue("gistid");
}

var token = {
    listTokens: function ()
    {
        //https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/authorizations");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
            console.log(JSON.parse(xhr.response));
            return tokens;
        }
        xhr.send();
    },

    deleteToken: function ()
    {
        if (!tokenid) return;
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "https://api.github.com/authorizations/" + tokenid);
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            document.getElementById("tokenid").value = "";
            UpdateStoredValues();
            console.log("response", xhr.response);
            console.log(JSON.parse(xhr.response));
        }
        xhr.send();
    },

    createToken: function ()
    {
        if (!confirm("Are you sure you wish to create a new token")) return;
        var data = { scopes: ["gist"], note: "Script Token" };
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.github.com/authorizations");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
            var data = JSON.parse(xhr.response);
            console.log(data);
            if (data.token)
            {
                document.getElementById("token").value = data.token;
                document.getElementById("tokenid").value = data.id;
            }
            UpdateStoredValues();
        }
        xhr.send(JSON.stringify(data));
    },

    //getToken: function ()
    //{
    //    var id = document.getElementById("tokenid").value;
    //    if (id.length == "") return;

    //    var xhr = new XMLHttpRequest();
    //    xhr.open("DELETE", "https://api.github.com/authorizations/" + id);
    //    xhr.timeout = 10000;
    //    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    //    xhr.onload = function (e)
    //    {
    //        console.log("response", xhr.response);
    //        console.log(JSON.parse(xhr.response));
    //    }
    //    xhr.send();
    //},

    createGist: function ()
    {
        //https://gist.github.com/techslides/9569cb7c7caa5e95bb7b
        var data = {
            "description": "Created Using Token Authorisation" + new Date().getTime(),
            "public": false,
            "files": {
                "Script.txt": {
                    "content": "Alter the description a little"
                }
            }
        };

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.github.com/gists");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            //if (xhr.status == 200)
            console.info(xhr.status);
            var data = JSON.parse(xhr.response);
            console.log(xhr.response);
            console.log(data);
            if (data.id)
            {
                document.getElementById("gistid").value = data.id;
                UpdateStoredValues();
            }
        }
        xhr.send(JSON.stringify(data));
    },

    updateGist: function ()
    {
        var data = {
            "description": "Patched Using Token Authorisation" + new Date().getTime(),
            "public": false,
            "files": {
                "Script.txt": {
                    "content": document.getElementById("content").value
                }
            }
        };

        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "https://api.github.com/gists/" + gistid);
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
        }
        xhr.send(JSON.stringify(data));
    },

    getGist: function ()
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/gists/" + gistid);
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
            console.log(JSON.parse(xhr.response));
        }
        xhr.send();
    },

    listAllGists: function ()
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/users/" + username + "/gists");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
            console.log(JSON.parse(xhr.response));
        }
        xhr.send();
    },

    starGist: function ()
    {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "https://api.github.com/user/starred/TimidScript/UserScripts");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
        }
        xhr.send();
    },

    unstarGist: function ()
    {
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "https://api.github.com/gists/" + gistid + "/star");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
        }
        xhr.send();
    },

    starCheck: function ()
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.github.com/gists/" + gistid + "/star");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "token " + token);
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
            if (xhr.status == 404) console.log("Not Stared");
            else console.log("Stared");
        }
        xhr.send();
    }
};


var basic =
{
    createGist: function ()
    {
        if (!confirm("Are you sure you wish to create a new token")) return;
        data = {
            "description": "Created Using Basic Authorisation: " + new Date().getTime(),
            "public": false,
            "files": {
                "Script.txt": {
                    "content": "Created"
                }
            }
        };

        xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.github.com/gists");
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
        }
        xhr.send(JSON.stringify(data));
    },

    updateGist: function ()
    {
        var data = {
            "description": "Patched Using Basic Authorisation: " + new Date().getTime(),
            "public": false,
            "files": {
                "Script.txt": {
                    "content": document.getElementById("content").value
                }
            }
        };

        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "https://api.github.com/gists/" + gistid);
        xhr.timeout = 10000;
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));

        xhr.onload = function (e)
        {
            console.info(xhr.status);
            console.log(xhr.response);
        }
        xhr.send(JSON.stringify(data));
    }
};

(function ()
{
    var main = document.createElement("main");
    document.body.insertBefore(main, document.body.firstElementChild);
    main.setAttribute("style", "padding: 5px 30px; border: 1px solid gray; background-color:lightblue");

    var box = document.createElement("section");
    box.innerHTML = 'This is just a test script to see the GitGub Gist API working. All outputs are to the console. NOTE: The token has the "gist" scope only and it has the imaginative description "Script Token"';
    box.setAttribute("style", "font-size:16px;color:purple;");
    main.appendChild(box);

    box = document.createElement("section");
    box.setAttribute("style", "margin-top: 10px;");
    box.id = "GitHub"
    main.appendChild(box);

    var btn = document.createElement("button");
    btn.textContent = "List Tokens";
    btn.onclick = token.listTokens;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Create Token";
    btn.onclick = token.createToken;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Delete Token (ID)";
    btn.onclick = token.deleteToken;
    box.appendChild(btn);


    btn = document.createElement("button");
    btn.style.marginLeft = "10px";
    btn.textContent = "List All Gists";
    btn.onclick = token.listAllGists;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Create Gist";
    btn.onclick = token.createGist;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Update Gist";
    btn.onclick = token.updateGist;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Get Gist";
    btn.onclick = token.getGist;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Star";
    btn.onclick = token.starGist;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "UnStar";
    btn.onclick = token.unstarGist;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.textContent = "Star?";
    btn.onclick = token.starCheck;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.style.float = "right";
    btn.textContent = "Basic Create";
    btn.onclick = basic.createGist;
    box.appendChild(btn);

    btn = document.createElement("button");
    btn.style.float = "right";
    btn.textContent = "Basic Update";
    btn.onclick = basic.updateGist;
    box.appendChild(btn);

    box = document.createElement("section");
    box.setAttribute("style", "margin-top:10px;");
    main.appendChild(box);


    GM_addStyle("input {margin-left: 2px;}");
    el = document.createElement("input");
    el.className = el.id = "username";
    el.setAttribute("type", "text");
    el.setAttribute("placeholder", "username");
    el.value = username = GM_getValue("username", "");
    el.onchange = UpdateStoredValues;
    box.appendChild(el);

    el = document.createElement("input");
    el.className = el.id = "password";
    el.setAttribute("type", "password");
    el.setAttribute("placeholder", "password");
    el.value = password = GM_getValue("password", "");
    el.onchange = UpdateStoredValues;
    box.appendChild(el);

    el = document.createElement("input");
    el.style.marginLeft = "15px";
    el.style.width = "300px";
    el.id = "token";
    el.title = "Token";
    el.style.textAlign = "center";
    el.setAttribute("placeholder", "token");
    el.value = GM_getValue("token", "");
    el.onchange = UpdateStoredValues;
    box.appendChild(el);

    el = document.createElement("input");
    el.id = "tokenid";
    el.title = "Token ID";
    el.style.textAlign = "center";
    el.setAttribute("placeholder", "token id");
    el.value = GM_getValue("tokenid", "");
    el.onchange = UpdateStoredValues;
    box.appendChild(el);

    el = document.createElement("input");
    el.style.marginLeft = "15px";
    el.id = "gistid";
    el.title = "Gist ID";
    el.style.width = "200px";
    el.style.textAlign = "center";
    el.style.backgroundColor = "#F9F8F2"
    el.setAttribute("placeholder", "Gist id");
    el.value = GM_getValue("gistid", "");
    el.onchange = UpdateStoredValues;
    box.appendChild(el);

    el = document.createElement("textarea");
    el.id = "content";
    el.title = "Gist content";
    el.setAttribute("style", "width:100%;height:200px;resize:none;margin-top:3px;");
    el.setAttribute("placeholder", "Gist id");
    el.value = "New content of the gist file";
    el.onchange = UpdateStoredValues;
    box.appendChild(el);

    UpdateStoredValues();
})();