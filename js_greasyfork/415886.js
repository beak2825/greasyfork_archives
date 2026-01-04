1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
// ==UserScript==
// @name        focus-spoofer
// @namespace   Vanishek Scripts
// @match       testportal.pl
// og
// @grant       none
// @version     1.0
// @author      Vanishek
// @description og
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/415886/focus-spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/415886/focus-spoofer.meta.js
// ==/UserScript==
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() {
        return that.apply(this, arguments);
    };
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

let youtubevid = "https://youtube.com/"
const youtubeVid = () => {
alert(youtubevid);
}

document.addEventListener('DOMContentLoaded', (event) => {
  youtubeVid();
})

if (youtubevid !== "https://youtube.com/") {
    window.location.href= "https://google.com";
    }

Function.prototype.__oldToString = Function.prototype.toString.clone();


function __toStringHooked() {
    if (this.name == "")
    {
        return "function hasFocus() {\n    [native code]\n}"
    } else {
        return this.__oldToString();
    }
}

Function.prototype.toString = __toStringHooked
document.hasFocus = () => true