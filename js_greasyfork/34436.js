// ==UserScript==
// @name         Wizard101 Black Market
// @namespace    https://waywardwoes.com
// @version      0.7
// @description  Get any wizard101 promotion on demand!
// @require      https://code.jquery.com/jquery-3.1.1.js
// @author       Tides (Tides#7945)
// @match        https://www.wizard101.com/user/kiaccounts/upgrade/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34436/Wizard101%20Black%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/34436/Wizard101%20Black%20Market.meta.js
// ==/UserScript==

if (confirm('Pssst... Would you like to access the Wizard101 Black Market? ;) ')) {

    var header = document.getElementById('genericFamilyDiscPromoterDiv');

    var box = document.createElement( 'div' );
    box.id = 'AlertBox';
    GM_addStyle(
        ' #AlertBox {             ' +
        '    background: #e3e3e3;     ' +
        '    padding: 4px;          ' +
        '    position: relative;    ' +
        '    z-index: 1000            ' +
        '    top: 8px;   ' +
        '    max-width: 2000px;      ' +
        ' } '
    );

    GM_addStyle(
        'button {' +
        'margin-top: 8px;' +
        'line-height: 30px;' +
        'font-weight: bold;' +
        'background: #7a59ba;' +
        'color: #ffffff;' +
        'border-radius: 8px;' +
        'max-width: 200px;' +
        'cursor: pointer;' +
        '}' +
        'button:hover {' +
        '  background: #a586e3;' +
        '}'
    );


    box.innerHTML = "<center><b> Secret Menu </b></center>" +
        "<center><i>Select any discounted promotional items below to add them to your cart.</i></center>" +
        '<center><button onclick="setItemIdToAdd(\'8ad6a404336396e101338997cf96529e\');setSelectedUser();"> 2,750 Crowns </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a404336396e101338997cf96529f\');setSelectedUser();"> 5,500 Crowns </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a404336396e101338997cf9652a0\');setSelectedUser();"> 16,500 Crowns </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a404336396e101338997cf9652a1\');setSelectedUser();"> 40,000 Crowns </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a41247ceacd70147d5af1afb02f0\');setSelectedUser();"> Mega Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124a0f73e1014a1629593012ac\');setSelectedUser();"> Super Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124a0f73e1014a1629590212a0\');setSelectedUser();"> Hive Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124a0f73e1014a1629593f12b0\');setSelectedUser();"> Hawk Rider Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124a0f73e1014a1629591312a4\');setSelectedUser();"> Atlantean Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124dabfd8f014db0a9470e124b\');setSelectedUser();"> Arcane Builder\'s Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a41254e6fe500155276baef559ba\');setSelectedUser();"> Aztecan Builder\'s Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124401578701444bf61f387819\');setSelectedUser();"> Pagoda Gauntlet </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a412461de4ff014629b99554060b\');setSelectedUser();"> Olympian Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a42a58b480510158bc1e1d121e6d\');setSelectedUser();"> Polarian Explorer\'s Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a412523abc8a01529eafa40a6609\');setSelectedUser();"> Spiral Cup Gauntlet </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a41247ceacd70147d5af1b0902f4\');setSelectedUser();"> Epic Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4123e833d9d013ea4c820ca5a12\');setSelectedUser();"> Majestic Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124f4a3133014f66e39b341373\');setSelectedUser();"> Evergreen Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124034126e01404faa624c0ec2\');setSelectedUser();"> Dino Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a412437127ef01439255bd4113b0\');setSelectedUser();"> Prehistoric Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a412549ee78b0154a177d19b1c3c\');setSelectedUser();"> Mystic Fishing Bundle </button>&nbsp&nbsp' +
        '<button onclick="setItemIdToAdd(\'8ad6a4124c07f0d6014c2935892f53c6\');setSelectedUser();"> Winterbane Gauntlet </button>&nbsp&nbsp</center><br>';

    header.parentNode.insertBefore(box, header);

    replaceTextOnPage("Wizard101 Store", "Wizard101 Black Market");
    replaceTextOnPage("Need Help?", "");
    replaceTextOnPage("KingsIsle Support is here!", "");
    replaceTextOnPage("Click here to Contact Support", "");

    $('body.wizardBackground').css({"background-color":"#7a59ba"});
    $('.bottomBackground').css({"background": "url(https://i.imgur.com/WQoIanG.png)"});
    $('.standardboxtopleft').css({"background": "url(https://i.imgur.com/rVpw8ai.png) no-repeat left -20px"});
    $('.standardboxtopright').css({"background": "url(https://i.imgur.com/rVpw8ai.png) no-repeat right -20px"});
    $('.standardboxmiddlelefttd').css({"background": "url(https://i.imgur.com/J5RBDYz.png) repeat-y left top"});
    $('.standardboxmiddlerighttd').css({"background": "url(https://i.imgur.com/J5RBDYz.png) repeat-y right top"});
    $('.standardboxcontenttable').css({"background-image": "url(https://i.imgur.com/eTinKHA.png"});
    $('.topBackground').css({"background": "transparent url(https://i.imgur.com/9AhbwDW.png) repeat-x left top"});
    $('H1').css({"color": "#FFFFFF"});
    $('.kiaccountstabs li a').css({"background": "url(https://i.imgur.com/9kipF1T.png) no-repeat right top"});
    $('.kiaccountstabs li a span').css({"background": "url(https://i.imgur.com/9kipF1T.png) no-repeat left top"});
    $('.kiaccountstabs li a.dormantTab').css({"background": "url(https://i.imgur.com/9kipF1T.png) no-repeat right -42px"});
    $('.kiaccountstabs li a.dormantTab span').css({"background": "url(https://i.imgur.com/9kipF1T.png) no-repeat left -42px"});
    $('.kiaccountstabs li a.dormantTab:hover').css({"background": "url(https://i.imgur.com/9kipF1T.png) no-repeat right -84px"});
    $('.kiaccountstabs li a.dormantTab:hover span').css({"background": "url(https://i.imgur.com/9kipF1T.png) no-repeat left -84px"});

    $('.homeLogo').remove();
    $('.sideMenuLogo').remove();
    $('.underLogo').remove();
} else {
    // Do nothing
}

function replaceTextOnPage(from, to){
  getAllTextNodes().forEach(function(node){
    node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'g'), to);
  });

  function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node){
      if(node.childNodes.length)
        for(var i = 0; i < node.childNodes.length; i++)
          scanSubTree(node.childNodes[i]);
      else if(node.nodeType == Node.TEXT_NODE)
        result.push(node);
    })(document);

    return result;
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
}

