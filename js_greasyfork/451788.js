// ==UserScript==
// @name        Get RGL by Discord ID
// @namespace   Violentmonkey Scripts
// @match       https://rgl.gg/Public/playersearch_.aspx
// @grant       none
// @version     1.0
// @author      Jercer
// @description Retrieve RGL page from DIscord ID easily
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451788/Get%20RGL%20by%20Discord%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/451788/Get%20RGL%20by%20Discord%20ID.meta.js
// ==/UserScript==
(function() {
    window.addEventListener("load", function() {
        var d = document.createElement("div");
        d.setAttribute('class', "input-group");

        var p = document.createElement("h5");
        p.innerText = 'OR Enter Discord ID to be taken directly to a player\'s page';

        var f = document.createElement("form");
        f.setAttribute('method',"post");

        var i = document.createElement("input");
        i.setAttribute('type',"text");
        i.setAttribute('name',"discordID");
        i.setAttribute('id',"discordID");
        //i.setAttribute('class',"form-control");
        i.setAttribute('placeholder', "Enter Discord ID...")

        const styles = {
            height: "34px",
            padding: "6px 12px",
            fontSize: "14px",
            color: "#555",
            backgroundColor: "#fff",
            backgroundImage: "none",
            border: "1px solid #ccc",
            position: "relative",
            zIndex: "2",
            float: "left",
            marginBottom: "0",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,.075)",
            transition: "border-color ease-in-out .15s,box-shadow ease-in-out .15s"
        }

        Object.assign(i.style, styles)

        var s = document.createElement("input");
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class', "btn btn-default")

        d.append(document.createElement("br"));
        d.append(p);
        d.append(document.createElement("br"));
        d.append(f);
        f.append(i);
        f.append(s);

        f.addEventListener('submit', function(){
            var did = this.elements['discordID'].value;
            if(did){
                this.action = 'https://rgl.gg/Public/PlayerProfile.aspx?d=' + did;
                this.submit();
            }
        }, false);

        document.querySelector("#ContentPlaceHolder1_pnlContent").children[1].children[2].children[0].append(d);
    }, false);
})();