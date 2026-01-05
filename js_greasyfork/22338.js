// ==UserScript==
// @name         AddNav
// @namespace    http://tampermonkey.net/
// @version      0.3
// @include
// @require
// @description  Adds navigation buttons to any website (forward/back)
// @author       SPENGLER
// @match        *://*
// @license      free
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22338/AddNav.user.js
// @updateURL https://update.greasyfork.org/scripts/22338/AddNav.meta.js
// ==/UserScript==

/*
Notes:
Dynamic DOM : http://www.w3schools.com/jsref/dom_obj_image.asp
Base64 Encoder : http://base64online.org/encode/ (/decode/)
//*/


function addNavButtons() {
    const images = { // encoded with http://base64online.org/encode/
        "back":     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAYAAAAc0MJxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMgSURBVHhe7dyxaxNxFMDx24qUooYmaZLGiHUQja1J2hIhwzk4KsRBsSbVmoZiatVN5Ai5VLBLIUT0r+iYIeMNGTJ06Oji7OAgirvPvPPOKKbpz+Td7+5++X3hQaHwo/30XXoN5RQ77VVVjwRj+szU6f6cmsyZnprWr15Z0vde76kWz69Wl7NGYCYAsXAc4tHzcG7iJwGhs2GIhmJQ1+uGiVR+XDZmz4QgnVoxGo3G34ITXFWr6teSKZifi4P2UlOV9GIGVlKrYH1e9kfNZlMP9pbo/t01Q4n01mtzoyyhjinRuxSfVp6BEg3NQ2ljU0IdE0LtbEuoEzM3yoQKS6hh9TdKQg1NQjEmoRiTUIxJKMY8AQXbivr5zQ0DKgqMMl/1lONft+tQPyrKyED2fN/NiA1FgfStnoFut+v4H/GuQdEgpbkgYa5A+Q0J4w5FgqTzRcK4QtFsUgo6nQ73Nxa5QVEg4W1Ap8N3k+y4QFFdbm5skp3jUBRIeEbXpU2ycxSKCsk6ztUcgxIJCXMESjQkjBxKRCSMFEpUJIwMSmQkjARKdCRsbCgKJJzDwyNX75NOaiwoKiScT7s5A54oultzcHAw9Ac1MhQlklfmaMhWjwQlIpI5vc2yvsV/+m8oYZFwqKCERsKhgDJf9AYdLtJQQH3Yvzf4cJGGAurL/k2xLzsc+RrFOFRQmPytxwiFyfsoRihMRKxWq0V7Z24nCtbHZhHwP2qsb2tgY0FhVFjWcZ5tbCiMAgvPsI7zZCRQmOhYZFCYyFikUJioWORQmIhYjkBhomE5BoWJhOUoFCYKluNQmAhYXKAwv2Nxg8L8jMUVCvMrFncozI9YrkBhfsNyDQrzE5arUJhfsFyHwiiwrKMcyxNQfkhCMSahGJNQjEkoxiQUYxKKsd9QMflYpKHh8+5MqAvxBcjfviOhBtRut9W52Qg833kBSuHBOkSCMXj39j33tzC8Xu56zggGwrBV3tKVWq2mLiQuAj7rLn8rD6VHJSg9tAY/ntDJLmcBnyaZvJTsL5Cm1dTCWhHwMsTXrEmfaDAKi5eXoFhYt5AU5SdBrVFOzMY0UgAAAABJRU5ErkJggg==",
        "forward":  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAYAAAAc0MJxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMaSURBVHhe7dy/TxNhHMfxZyOGELGhLW0pGHEwimD5lZp0OAdHTeqgEQuKpSEWUDdjGtIrJrKQkBr9KxgZOt7QoQMDo4uzg4PRuPv1vscBVa/0OQr3fJ/0+04+iWGweV65O1tDKg6bzy1Y49cnIB6OQyIy1PW7khyF3Nw8lEplwyUSYuzamDXQH4H0dBryz/Ldu6fu7D9n72UhFknA6MhVKJdtrOXCshkORSFzO2O5bpzbxw+frFg4AbknCyBerb2GwYEY1Gq140uMOyp7/4FzG4q1lZcwHB8B9+fcP+UXl5xnlgM1Er/MUC1CqHiUodrGUJIxlGQMJRlDScZQkgUOBUUBnex3USj55BA4FB7UC8DPVGApufV0xFL2jNINS+nDXCcspVCYLljKoTAdsEhAYdSxyEBhlLFIQWFUschBYRSxSEJh1LDIQmGUsEhDYVSwyENhFLC0gMJUY2kDhanE0goK8zq8350GyxcUrAjjS3Xe88V1m18saajd3V3D6wV1nh8saSh4IUyvF9N9slhdD4WTwWIod+2wGKpp37futsRiqKZ93nrU8vwM1Tz7jO5x/4uh3PEzSmL8r57Ezvx91P7ePr8zl4HCdnZ2DOfKUrSvG5mO//fgcH6QMF9Qqts7o6vaLxKmFRQe0OvgfnYaJEwbKJVImBZQqpEw8lAUkDDSUFSQMLJQlJAwklDUkDBSUI16w6CIhJGBqtfrxk9z0vPgfnYeSBgJqLp9Jf0wU54H97PzQsKUQzlXUoU2EqYUqtFokL7dmlMG5SBV9EDClEDphoQFDnWANOV5cD8LEgkLHOrXhn5IWOBQnbwN+Pb+joW/UeP+VYGm7GGuWwwlGUNJxlCSMZRkDCXZEdQqQ52YA8Vfi9S+I6jVIkOd1NJiwfmuO/H44ZwV7o9AtVpt+ctU3dxMahYmx6dAlN6UjKHBJNwaS8F6aZ2x3La3t43J1IzzbZKF54WDz5gVs2LF7csrcinqfN/dsH0rdvOS9hLRJIT6QjA7nf77g/jmu03j5o0Js7en1+y7cLE713O8WDhhlt4e3mFC/AHAB1FOVCV5+gAAAABJRU5ErkJggg=="
    };

    var x = document.createElement("IMG");
    x.setAttribute("src", images.back);
    x.setAttribute("id", "nav-back-xdxdnjdmewymd");
    x.setAttribute("width", "74");
    x.setAttribute("height", "74");
    x.setAttribute("alt", "back");
    x.setAttribute("style", "position:absolute; top:0px;  left:0px; margin:0px; padding:0px; font-size:14; cursor:pointer; opacity:0.5;");
    x.setAttribute("onclick", "window.history.back(); return false;");
    document.body.appendChild(x);

    var y = document.createElement("IMG");
    y.setAttribute("src", images.forward);
    y.setAttribute("id", "nav-forward-jjvtjqotsr");
    y.setAttribute("width", "74");
    y.setAttribute("height", "74");
    y.setAttribute("alt", "forward");
    y.setAttribute("style", "position:absolute; top:0px; right:0px; margin:0px; padding:0px; font-size:14; cursor:pointer; opacity:0.5;");
    y.setAttribute("onclick", "window.history.forward(); return false;");
    document.body.appendChild(y);
}
addNavButtons();

var onScrollFloatButtons = function() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    document.getElementById('nav-back-xdxdnjdmewymd').style.top = scrollTop;
    document.getElementById('nav-forward-jjvtjqotsr').style.top = scrollTop;
};
document.addEventListener ("scroll", onScrollFloatButtons);