// ==UserScript==
// @name         Neoboard Quick User Links
// @version      1.0
// @namespace    tampermonkey.net
// @description  Adds some icons on message form that make it easier to get your links
// @author       Nyu (clraik)
// @match        http://www.neopets.com/neoboards/*
// @downloadURL https://update.greasyfork.org/scripts/29563/Neoboard%20Quick%20User%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/29563/Neoboard%20Quick%20User%20Links.meta.js
// ==/UserScript==






// Change these if you want


var user=document.getElementsByClassName('user medText')[0].children[0].innerHTML.replace("user","");//Looks for the username and saves it as text (Thanks to my cousin for the idea <3)
var username=user;//username is the logged user, you can change if you'd like your neomails elsewhere. (replacing user for "USERNAME")
//username will be added to neomail, trading post, auctions and gallery links.
var ncTradeList="";//You can also have a nc trade list option if you want (If left blank it won't appear)
// http://impress.openneo.net/user/EXAMPLE_USER/closet
// or http://items.jellyneo.net/mywishes/EXAMPLE_USER/
var petPage="http://www.neopets.com/~";//If you want to have petpage too, add it here. (If left blank or as is it won't appear)




/////////////////////////////////////////////////////////////////
////If you don't know what you're doing don't edit below this////
/////////////////////////////////////////////////////////////////






var z=0;
var neomailLink="http://www.neopets.com/neomessages.phtml?type=send&recipient="+username;
var tpLink="http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string="+username;
var aucLink="http://www.neopets.com/genie.phtml?type=find_user&auction_username="+username;
var galleryLink="http://www.neopets.com/gallery/index.phtml?gu="+username;
if(document.URL.indexOf("http://www.neopets.com/neoboards/create_topic.phtml?") != -1) {
    var htex=document.getElementsByTagName("form")[1].getElementsByTagName("table")[1].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("td")[0];
    var a = document.createElement ('a');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('onclick', 'insertSmiley("'+neomailLink+'")');
    a.setAttribute('return', 'false:;');
    a.innerHTML   = '<img src="http://images.neopets.com/neocircles/envelope.gif" width="21" height="21" alt="Paragraph" border="0" title="Add neomail link"></a>&nbsp';
    htex.appendChild(a);
    z++;
    if (ncTradeList!==""){
        var b=document.createElement('a');
        b.setAttribute('href', 'javascript:;');
        b.setAttribute('onclick', 'insertSmiley("'+ncTradeList+'")');
        b.setAttribute('return', 'false:;');
        b.innerHTML='<img src="http://images.neopets.com/games/arcade/nav_buttons/posting.png" width="21" height="21" alt="Paragraph" border="0" title="Add NC TL link"></a>&nbsp';
        htex.appendChild(b);
        z++;
    }


    if (petPage!==""&&petPage!=="http://www.neopets.com/~"){
        var c=document.createElement('a');
        c.setAttribute('href', 'javascript:;');
        c.setAttribute('onclick', 'insertSmiley("'+petPage+'")');
        c.setAttribute('return', 'false:;');


        c.innerHTML='<img src="http://images.neopets.com/games/arcade/nav_buttons/star.png" width="21" height="21" alt="Paragraph" border="0" title="Add petpage link"></a>&nbsp';
        if (z!==2){
            htex.appendChild(c);
            z++;
        }
        else{
            c.innerHTML="<br>"+c.innerHTML;
            htex.appendChild(c);
            z++;
        }
    }
    var d = document.createElement ('a');
    d.setAttribute('href', 'javascript:;');
    d.setAttribute('onclick', 'insertSmiley("'+tpLink+'")');
    d.setAttribute('return', 'false:;');
    d.innerHTML   = '<img src="http://images.neopets.com/games/arcade/nav_buttons/background.png" width="21" height="21" alt="Paragraph" border="0" title="Add trading post link"></a>&nbsp';


    if(z!==2){
        htex.appendChild(d);
        z++;
    }else{
        d.innerHTML="<br>"+d.innerHTML;
        htex.appendChild(d);
        z++;
    }
    var e = document.createElement ('a');
    e.setAttribute('href', 'javascript:;');
    e.setAttribute('onclick', 'insertSmiley("'+aucLink+'")');
    e.setAttribute('return', 'false:;');


    e.innerHTML   = '<img src="http://images.neopets.com/games/arcade/cat/world_brv.png" width="21" height="21" alt="Paragraph" border="0" title="Add auction link"></a>&nbsp';


    if(z!==2){
        htex.appendChild(e);
        z++;
    }else{
        e.innerHTML="<br>"+e.innerHTML;
        htex.appendChild(e);
        z++;
    }
    var f = document.createElement ('a');
    f.setAttribute('href', 'javascript:;');
    f.setAttribute('onclick', 'insertSmiley("'+galleryLink+'")');
    f.setAttribute('return', 'false:;');


    f.innerHTML   = '<img src="http://images.neopets.com/games/arcade/nav_buttons/site_item.png" width="21" height="21" alt="Paragraph" border="0" title="Add gallery link"></a>&nbsp';


    if(z!==2){
        htex.appendChild(f);
        z++;
    }else{
        f.innerHTML="<br>"+f.innerHTML;
        htex.appendChild(f);
        z++;
    }
}
if(document.URL.indexOf("http://www.neopets.com/neoboards/topic.phtml?") != -1) {
    var htex2=document.forms.message_form.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[1].getElementsByTagName("td")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0];
    var h = document.createElement ('a');
    h.setAttribute('href', 'javascript:;');
    h.setAttribute('onclick', 'insertSmiley("'+neomailLink+'")');
    h.setAttribute('return', 'false:;');
    h.innerHTML   = '<img src="http://images.neopets.com/neocircles/envelope.gif" width="21" height="21" alt="Paragraph" border="0" title="Add neomail link"></a>&nbsp';
    //document.getElementsByTagName("form")[1].getElementsByTagName("table")[1].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("td")[0].appendChild(a);
    htex2.appendChild(h);
    z++;
    if (ncTradeList!==""){
        var i=document.createElement('a');
        i.setAttribute('href', 'javascript:;');
        i.setAttribute('onclick', 'insertSmiley("'+ncTradeList+'")');
        i.setAttribute('return', 'false:;');
        i.innerHTML='<img src="http://images.neopets.com/games/arcade/nav_buttons/posting.png" width="21" height="21" alt="Paragraph" border="0" title="Add NC TL link"></a>&nbsp';
        htex2.appendChild(i);
        z++;
    }


    if (petPage!==""&&petPage!=="http://www.neopets.com/~"){
        var j=document.createElement('a');
        j.setAttribute('href', 'javascript:;');
        j.setAttribute('onclick', 'insertSmiley("'+petPage+'")');
        j.setAttribute('return', 'false:;');
        j.innerHTML='<img src="http://images.neopets.com/games/arcade/nav_buttons/star.png" width="21" height="21" alt="Paragraph" border="0" title="Add petpage link"></a>&nbsp';
        if (z!=2){
            htex2.appendChild(j);
            z++;
        }
        else{
            j.innerHTML="<br>"+j.innerHTML;
            htex2.appendChild(j);
            z++;
        }
    }
    var k = document.createElement ('a');
    k.setAttribute('href', 'javascript:;');
    k.setAttribute('onclick', 'insertSmiley("'+tpLink+'")');
    k.setAttribute('return', 'false:;');
    k.innerHTML   = '<img src="http://images.neopets.com/games/arcade/nav_buttons/background.png" width="21" height="21" alt="Paragraph" border="0" title="Add trading post link"></a>&nbsp';


    if(z!==2){
        htex2.appendChild(k);
        z++;
    }else{
        k.innerHTML="<br>"+k.innerHTML;
        htex2.appendChild(k);
        z++;
    }


    var l = document.createElement ('a');
    l.setAttribute('href', 'javascript:;');
    l.setAttribute('onclick', 'insertSmiley("'+aucLink+'")');
    l.setAttribute('return', 'false:;');
    l.innerHTML   = '<img src="http://images.neopets.com/games/arcade/cat/world_brv.png" width="21" height="21" alt="Paragraph" border="0" title="Add auction link"></a>&nbsp';
    if(z!==2){
        htex2.appendChild(l);
        z++;
    }else{
        l.innerHTML="<br>"+l.innerHTML;
        htex2.appendChild(l);
        z++;
    }
    var m = document.createElement ('a');
    m.setAttribute('href', 'javascript:;');
    m.setAttribute('onclick', 'insertSmiley("'+galleryLink+'")');
    m.setAttribute('return', 'false:;');
    m.innerHTML   = '<img src="http://images.neopets.com/games/arcade/nav_buttons/site_item.png" width="21" height="21" alt="Paragraph" border="0" title="Add gallery link"></a>&nbsp';
    if(z!==2){
        htex2.appendChild(m);
        z++;
    }else{
        m.innerHTML="<br>"+m.innerHTML;
        htex2.appendChild(m);
        z++;
    }
}


