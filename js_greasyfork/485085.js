

    // ==UserScript==
    // @name         Richup.io - Palestine 🇵🇸
    // @namespace    http://tampermonkey.net/
    // @version      1.0.0
    // @description  changes the tiles of the fictional place srael into the country and rightful owner of the soil, Palestine!
    // @author       RedspearXIII
    // @license MIT
    // @match         *://www.Richup.io/*
    // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
    // @grant           GM_getResourceText
    // @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485085/Richupio%20-%20Palestine%20%F0%9F%87%B5%F0%9F%87%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/485085/Richupio%20-%20Palestine%20%F0%9F%87%B5%F0%9F%87%B8.meta.js
    // ==/UserScript==
     
     
     
     
     
    GM_addStyle ( `
     
div.richup-block-top:nth-child(8) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(2)
{opacity:0;}

div.richup-block-top:nth-child(8) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)
{opacity:0;}

div.richup-block-top:nth-child(9) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)
{opacity:0;}

div.richup-block-top:nth-child(9) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(2)
{opacity:0;}

div.richup-block-top:nth-child(6) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)
{opacity:0;}

div.richup-block-top:nth-child(6) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(2)
{opacity:0;}

div.richup-block-top:nth-child(9) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(2)
{opacity:0;}

div.richup-block-top:nth-child(9) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)
{opacity:0;}

div.richup-block-top:nth-child(6) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)
{opacity:0;}

div.richup-block-top:nth-child(6) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(2)
{opacity:0;}

div.richup-block-top:nth-child(8) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)
{opacity:0;}

div.richup-block-top:nth-child(8) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(2)
{opacity:0;}


div.richup-block-top:nth-child(8) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1)
{
background: url("https://flagdownload.com/wp-content/uploads/Flag_of_Palestine_Flat_Round.png");
background-size: cover;
}

div.richup-block-top:nth-child(9) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1)
{
background: url("https://flagdownload.com/wp-content/uploads/Flag_of_Palestine_Flat_Round.png");
background-size: cover;
}


div.richup-block-top:nth-child(6) > div:nth-child(3) > div:nth-child(1) > svg:nth-child(1)
{
background: url("https://flagdownload.com/wp-content/uploads/Flag_of_Palestine_Flat_Round.png");
background-size: cover;   
}


div.richup-block-top:nth-child(9) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1)
{
background: url("https://media.istockphoto.com/id/525982638/vector/palestine-flag.jpg?s=612x612&w=0&k=20&c=agfJtXme3_SCpGTqRaOk7yQQHptpZ4aiV6Rt4l6pigg=");
background-size: cover;
}


div.richup-block-top:nth-child(6) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1)
{
background: url("https://media.istockphoto.com/id/525982638/vector/palestine-flag.jpg?s=612x612&w=0&k=20&c=agfJtXme3_SCpGTqRaOk7yQQHptpZ4aiV6Rt4l6pigg=");
background-size: cover;
}


div.richup-block-top:nth-child(8) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1)
{
background: url("https://media.istockphoto.com/id/525982638/vector/palestine-flag.jpg?s=612x612&w=0&k=20&c=agfJtXme3_SCpGTqRaOk7yQQHptpZ4aiV6Rt4l6pigg=");
background-size: cover;
}


div.richup-block-top:nth-child(9) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1)
{
width: 0px;
font-size: 0%;
}


div.richup-block-top:nth-child(9) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1)::after
{
  position: absolute;
  top: auto;
  left: 0;
  content: "Al Quds";
  color: white;
  width: 100%;
  font-size: 1rem;
}


    ` );

