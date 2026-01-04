// ==UserScript==
// @name           Popmundo - Diary Entries Filterer
// @name:tr        Popmundo - Günlük Girdilerini Filtreleme

// @description    With this user script, you will be able to filter entries in your own or someone else's diary. It is intended to be used for counting or verification purposes in competitions or for other specific needs.
// @description:tr Bu kullanıcı scripti ile birlikte kendinizin ya da başka birisinin günlüğündeki entry'leri filtreleyebileceksiniz. Bu sayede yarışmalarda ve ya başka bir amaçla sayım ya da kontrol için kullanılması hedeflenmiştir.

// @version        1.0.1
// @icon

// @author         Appriapos

// @match          https://*.popmundo.com/World/Popmundo.aspx/Character/Diary*

// @grant          unsafeWindow
// @grant          GM_addStyle

// @license        MIT

// @run-at         document-body
// @namespace      https://greasyfork.org/users/733822
// @downloadURL https://update.greasyfork.org/scripts/525559/Popmundo%20-%20Diary%20Entries%20Filterer.user.js
// @updateURL https://update.greasyfork.org/scripts/525559/Popmundo%20-%20Diary%20Entries%20Filterer.meta.js
// ==/UserScript==


let jQuery=unsafeWindow.jQuery;


let locales = {
    en : {
        boxTitle1: 'Filter diary entries',
        text1: 'Filter by using regular expression:',
        button1: 'Filter',
    },

    tr : {
        boxTitle1: 'Günlük girdilerini filtrele',
        text1: 'Düzenli ifade kullanarak filtreleyin:',
        button1: 'Filtrele'
    }
};
let locale;

jQuery(unsafeWindow.document).ready(()=>{

    locale = (e=>{ //Get locale
        if(!e.length) stopScript(new Error('_ucMenu_lnkStart NOT FOUND!'));
        let langKey;
        switch(e.text().trim()){
            case 'Hoş Geldiniz!':
                langKey = 'tr';
                break;
            default:
                langKey = 'en';
                break;
        }

        if(!locales.hasOwnProperty(langKey)) stopScript(new Error(`An undefined language key(${langKey}) was detected!`))

        return locales[langKey];
    })(FindElementEndsWithID('_ucMenu_lnkStart'));
    locales = undefined;

    (e=>{
        if(!e.length) stopScript(new Error('ctl00_cphLeftColumn_ctl00_ddlNavigate<div.box:first NOT FOUND!'));

        e.before(
            `<div class="box">`+
            `   <h2>${locale.boxTitle1}</h2>`+
            `   <p>`+
            `      <label> ${locale.text1} `+
            `         <span style="border: 1px solid black; padding: 2px; background-color: white; margin-right: 2px; user-select:none;">`+
            `            <font color="gray"><b>/</b></font>`+
            `            <input type="text" id="regexString" style="border: none;">`+
            `            <font color="gray"><b>/</b></font>`+
            `            <input type="text" id="regexFlags" value="gi" style="border: none; width:45px;">`+
            `         </span>`+
            `      </label>`+
            `   </p>`+
            `   <p class="actionbuttons">`+
            `      <input type="button" id="filterByRegex" value="${locale.button1}">`+
            `   </p>`+
            `</div>`
        );

        GM_addStyle(
            `.matched-part{background-color:yellow;}`
        );

        let inTag = (tags, start, end)=>{
            let t = [start,end];
            return tags.find(tag=>t.find(k=>tag[0]<=k && k<=tag[1]));
        };

        let block = false;
        jQuery('#regexString, #regexFlags').keyup(function(e){
            if(e.keyCode==13 && !block){
                jQuery('#filterByRegex').click();
            }
        });

        jQuery('#filterByRegex').click(function(){
            jQuery(this).prop('disabled', true).hide().before('<span>Loading...</span>')
            block = true;
            try{
                let regexString = jQuery('#regexString').val().trim(),
                    regexFlags = jQuery('#regexFlags').val().trim(),
                    regex = RegExp(regexString, regexFlags),
                    globalFlag = regexFlags.indexOf('g')!=-1;

                if(regexString != ""){
                    jQuery('#ppm-content .diaryExtraspace>li').each(function(){ //Days
                        let day = this.childNodes[0].textContent; //Exp: 03.02.2021

                        jQuery('>ul>li', this).each(function(){ //Entries
                            let li_entry = jQuery(this);

                            if(li_entry.hasClass('filtered-entry')){ //Remove previous filter ones
                                li_entry.removeClass('filtered-entry').find(' .matched-part').each(function(){
                                    jQuery(this).before(this.textContent).remove();
                                });
                            }

                            let text = li_entry.text().trim(),
                                time = text.substr(0, 5);
                            text = text.substr(7);

                            if(!regex.test(text)){ //Not matched
                                li_entry.hide();
                                return;
                            }

                            //Matched entry...

                            if(li_entry.children().length==0){
                                text = text.replace(regex, matched=>`<span class="matched-part">${matched}</span>`);
                                li_entry.html(`${time}: ${text}`).show().addClass('filtered-entry');
                            }
                            else{
                                let html = li_entry.html().trim().substr(7);
                                let tags = [...html.matchAll(/<[^>]*>/g)].map(m=>[m.index, m.index+m[0].length]);
                                html = html.replace(regex, (matched, p1,p2)=>{
                                    let index = Number.isInteger(p1)?p1:p2;
                                    if(inTag(tags, index, index+matched.length)) return matched;
                                    return `<span class="matched-part">${matched}</span>`;
                                });

                                li_entry.html(`${time}: ${html}`).show().addClass('filtered-entry');
                            }

                        });

                    });
                }
                else{
                    jQuery('#ppm-content .diaryExtraspace>li>ul>li:hidden').show();
                }
            }
            catch(err){
                console.error(err);
            }
            setTimeout(()=>{
                jQuery(this).prop('disabled', false).show().prev().remove();
                block = false;
            }, 1000);
        });

    })(FindElementEndsWithID('_ddlNavigate').parents('div.box').first());
});


function FindElementEndsWithID(end) {
    return jQuery(`[id$="${end}"]`);
}

function stopScript(err){
    alert(err.message||err);
    throw new Error(err);
}