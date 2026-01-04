// ==UserScript==
// @name         WhatsApp links in Google Contact phone numbers
// @namespace    https://github.com/yoonkit/GoogleContactsWhatsApp
// @version      0.6
// @description  Adding a WhatsApp icon to Google Contacts phone numbers for a quick chat
// @author       Yoon-Kit Yong
// @donate       PayPal some love to yoonkit@gmail.com [ https://www.paypal.com/paypalme/yoonkit ]
// @license      GPLv3
// @match        https://contacts.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/471933/WhatsApp%20links%20in%20Google%20Contact%20phone%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/471933/WhatsApp%20links%20in%20Google%20Contact%20phone%20numbers.meta.js
// ==/UserScript==


// var $ = window.jQuery; // 230729 yky Watch out for Apple problems with jQuery
// var debug = -1; //230729 yky Set to -1 for production, 0 for debug

var verbosity = 3
document.verbosity = verbosity

function ykAlert( msg, type )
{
    /* Messages for debugging with varying degrees of reporting methods
     *     -1 : Boldify
     *      0 : console.log <Default>
     *      1 : light verbose
     *      2 : medium verbose
     *      3 : very verbose
     *     10 : window.alert (very annoying)
     * 230728 yky Created
	 * 230820 yky Modified - verbosity, caller function name, indent
	 * 240502 yky Modified - caller crash on main call
     */
    if (type == null) type = 1
    if (type < 0) console.log( '*** ' + msg + ' ***' )
    else if (type == 10) window.alert( msg )
    else if (type <= document.verbosity)
    {
        let fname = ""
        let caller = null
        if (ykAlert.hasOwnProperty("caller")) caller = ykAlert.caller
        if (caller != null) fname = ' (' + caller.name + ') '
        let spacer = "-".repeat(type*2) + ": "
        console.log( spacer + msg + fname );
    }
    return 0;
}

ykAlert("WhatsApp links for Google Contacts loading", 2)

// https://icons8.com/icon/ChMMcyjCQnEn/whatsapp
// 230728 yky Small 16x16 icon for Whatsapp encoded inline. Detailed view is defaulted by css at 20x20 tho.
var whatsappICO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAACvklEQVR4nHVT204TURQdTUw0foDGNxN/wB/wT0yMD74TMdAO7QwXAeltZqpC6WWmUwgIRm4KCJSKtBYppSQgUmgVbGmxtQXamUJLYJlOYhPAruS8nLX3ys5aexPEBdQbrPdIE89QrHNbbXAcq/SOEs06dynW6ajT2+4T1UBR1FWNSdBrGKEw8ilwEo6l8UcqISufIJrMYvLLyinNibKWc/ZRFH/9UrOWFcbMPaNS4kDG/E4QrxftoGafQ+NuBuPvxHTUi1SuAGHYXdCyztA5kQZGaGRdw1IyLymNqintf5/Ba0Ystw/nsFvWskKv0lzbwd9uMAlyLJuHJSCg2dOOmagHTZ62qiKpfAE0K8qKJ6TeUdv7fq4QSKwrBYvxJZQxtTVTdZKZqA8T3tApxTptBP3S5Q2GdyCG3ihkOL2pCKynNqoKsP4uRJJZUKwYJyhW3I4kMjD5Xink0PqoItCz0ldVQOtuQUY+gdpgLxKNnCscjqXA+S0KSU7TiGR+IFvIom1OV/nTupsrAvRsK9L5Ikijo0DQZte4fzWCvtXhSkGLpx2JXBL5ooTBtXcI7oYglWR8CE8qfOeiHRu/UqA5MUqo9bbHXf3jufX0zrkxG2dbEYgHcYYz/MNWJqpwvl/LGJn9WiJNgp6oMQzcaDDyUjyTh3mh+3JsPg6Tm1OY3JxWou0K8Njdl6BhBJnUdd8lnlgs19RGx9He4RHa5ozomGeqmmddErGXl8G5RiSS4VuVRarT2R7obG8PD4qnSMtH+J07xrfUtuJJ2dhyOq6VQSwnN1Ce0iQMSTTrHCqvvyJAGvl2Thw5tQ5+zGkY4UhtcBQt/RP5hbUIyumU8w58/wnXmKegMfGS1sSTBHClcgcqg32UYsWBep3t4bMXtjtPdeLNug7boyazOE5zrs3yWdPmns8qnb1GxVhvXTzjv0Yqm3Pl1utJAAAAAElFTkSuQmCC";

function generateWhatsApp( phonetext )
{
    /* Creates the elements for a WhatsApp icon and url
     *     link (url to wa.me)
     *         icon (inline | alt text)
     *     removes whitespaces and other symbols as wa.me only takes in full numbers
     *     havent done anything for no country codes yet.
     * 230728 yky Created
     *     havent solved the overriding css for the bounding class as it defaults to wxh of 20px
     */
    let phone = phonetext.replaceAll("+","");
    phone = phone.replaceAll(" ","");
    phone = phone.replaceAll("-","");
    phone = phone.replaceAll("x","");

    let ico = document.createElement('img');
    //ico.src = "https://static.whatsapp.net/rsrc.php/v3/yz/r/ujTY9i_Jhs1.png";
    ico.src = whatsappICO;
    ico.alt = "WhatsApp";
    //ico.height = "16px";
    //ico.width = "16px";
    //ico.style = "{ 'padding-left':'8px' }";


    let url = "http://wa.me/"+phone;
    ykAlert(url, 6);

    let link = document.createElement('a');
    link.href = url;
    link.text = "  ";
    link.appendChild(ico);
    return link;
}

function getPhoneDetails() 
{
    /* Searches the Contact Details page for telephones to iconize
     *     makes it look standard with the same spans and dots 
     *         span
     *             dot
     *             icon
     *     Gets the icon link from generateWhatsApp
     * 230728 yky Created
     *     setting the class is via setAttribute
     *     if Google changes the classnames this will have to be updated
     *         phone div: "urwqv"
     *         span: "UvDwpb"
     *         dot: "tZ08dd"
     * 230729 yky Fixed for Safari - the jQuery doesnt return all Elements.
     */

    var telsj = document.getElementsByClassName("urwqv"); 
    ykAlert("Phone details found: " + telsj.length, 2 );


    for (let tel of telsj)
    {
        let as = tel.getElementsByTagName('a');
        ykAlert( "as length: " + as.length, 6);

        if (as.length == 1)
        {
            let a = as[0];
            if (a.href.includes('tel:'))
            {
                var span = document.createElement('span');
                span.setAttribute( "class", "YvDwpb");

                var dot = document.createElement('span');
                dot.setAttribute( "class", "tZ08dd");
                dot.setAttribute( "aria-hidden", "true");
                dot.textContent = "•";
                //dot.id = "dot";
                span.appendChild(dot);

                var link = generateWhatsApp( a.text );
                span.appendChild(link);

                tel.appendChild(span);
            }
        }
    }
    return telsj;
}



function getPhoneColumn()
{
    /* Searches the entire Contact list for the Phone Number Column and attaches WhatsApp links
     *     if the phone number length is more than 7
     *     checks if it already has a link, it wont create another one.
     * 230728 yky Created
	 * 240516 yky Modified - class "b62A4e" doesnt exist anymore. Using aria-describedby=phone-column
     */
    // var phones = document.getElementsByClassName("b62A4e"); // 240516 yky this doesnt work anymore
	
    var arias = document.querySelectorAll("[aria-describedby]"); // 240516 yky looking for phone-column
	phones = []
	
	for (let aria of arias) 
	{
		descr = aria.getAttribute('aria-describedby')
		if ( descr.indexOf("phone-column") >= 0) phones.push(aria)
	}
	
	if ((document.URL == 'https://contacts.google.com/') & (phones.length == 0)) ykAlert("No Phone Columns detected", -1 )
	
    for (let phone of phones)
    {
        let as = phone.getElementsByTagName('a');
        if (as.length > 0) continue; // 230728 yky Link already created

        let phonetext = phone.textContent;
        if (phonetext.length > 7)
        {
            var link = generateWhatsApp( phonetext );
            phone.appendChild(link);
        }
    }
}


// 230728 yky Using setTimeout instead of waitForKeyElements.
setInterval( function () { getPhoneDetails() }, 2000)
setInterval( function () { getPhoneColumn() }, 2000)
ykAlert("WhatsApp links for Google Contacts Loaded", 0)
