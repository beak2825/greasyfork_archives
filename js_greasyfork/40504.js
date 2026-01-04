// ==UserScript==
// @name         OverDrive to BIB
// @namespace    O2B
// @version      1.2
// @description  Fill BIB upload using OverDrive
// @author       qwent
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @match        http://*.overdrive.com/*media/*
// @match        https://*.overdrive.com/*media/*
// @match        https://bibliotik.me/upload/ebooks
// @match        https://bibliotik.me/upload/audiobooks
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/40504/OverDrive%20to%20BIB.user.js
// @updateURL https://update.greasyfork.org/scripts/40504/OverDrive%20to%20BIB.meta.js
// ==/UserScript==

"use strict";

GM.setValue("anonymous", true); //set to false to uncheck anonymous


function parseOverDrive(od){
    const title = decode(getTitle(od));
    const description = decode(getDescription(od));
    const publisher = decode(od.publisher.name.split("/", 1)[0].replace(", LLC",""));
    let imageUrl = "";
    if (od.covers.cover510Wide != null) {
        imageUrl = od.covers.cover510Wide.href;
    }
    const language = od.languages[0].name.split(",", 1)[0].split(";", 1)[0];
    const abridged = od.edition === "Unabridged";
    const [authors, editors, translators, narrators, contributors] = getCreators(od);
    const tags = getTags(od);
    const [format,duration,isbn,year] = getFormatInfo(od);

    GM.setValue("title",title);
    GM.setValue("authors",authors);
    GM.setValue("editors",editors);
    GM.setValue("translators",translators);
    GM.setValue("narrators",narrators);
    GM.setValue("contributors",contributors);
    GM.setValue("description",description);
    GM.setValue("publisher",publisher);
    GM.setValue("tags",tags);
    GM.setValue("language",language);
    GM.setValue("imageUrl",imageUrl);
    GM.setValue("format",format);
    GM.setValue("duration",duration);
    GM.setValue("isbn",isbn);
    GM.setValue("year",year);
}


function getCreators(od){
    const creators = {"Author":[],"Editor":[], "Translator":[], "Narrator":[],"Contributor":[]};
    const creatorsKeyArr = ["Author", "Editor", "Translator", "Narrator","Contributor"];
    for(const creator of od.creators){
        const name = decode(fixName(creator.name));
        const role = creator.role;
	if(creatorsKeyArr.includes(role))
	    creators[role].push(name);
	else
	    creators["Contributor"].push(name); //"Author of" or "Artist"
    }

    for(const role of creatorsKeyArr){
	if(role.length > 0){
	    creators[role] = creators[role].join(", ");
	}
    }
    const creatorsValArr = creatorsKeyArr.map(k => creators[k]);
    return creatorsValArr;
}


function getTitle(od){
    const subtitle = od.subtitle;
    const series = od.series;
    let title = od.title;
    let edition = "";

    if(series != null){
        if(subtitle != null){
            if(subtitle.includes("Series") ||
	       subtitle.includes("Book ") ||
               subtitle.includes("Volume ")){
		title = `${title} (${subtitle})`.replace(" Series","");
            }
            else
		title = `${title}: ${subtitle} (${series})`;
	}
	else
	    title = `${title} (${series})`.replace(" Series","");
    }
    else{
        if(subtitle != null)
	    title = `${title}: ${subtitle}`;
    }

    if(od.type.name == "eBook" && od.edition != null){
        edition = " (" + od.edition;
        if(od.edition === "1"){return title;}
        else if(od.edition === "2"){edition = edition + "nd";}
        else if(od.edition === "3"){edition = edition + "rd";}
        else if(!isNaN(od.edition)){edition = edition + "th";}
        edition = edition + " Edition)";
        title = title + edition;
    }
    return title;
}


function getFormatInfo(od){ //set format,isbn and year
    const formats = {"EPUB eBook": "EPUB", "PDF eBook": "PDF", "OverDrive Read": "AZW3"};
    const formatsKeyArr = ["EPUB eBook", "PDF eBook", "OverDrive Read"];
    let foundFormat = false;
    let format = "";
    let duration = "";
    let isbn = "";
    let year = "";
    let formatInfo;

    if(od.type.name === "eBook"){
	for(const formatName of formatsKeyArr){
	    if(foundFormat)
		break;
            
	    for(const f of od.formats){
		if(f.name.includes(formatName)){
		    formatInfo = f;
		    format = formats[formatName];
		    foundFormat = true;
		    break;
		}
	    }
	}
	if(!foundFormat)
	    format = "AZW3";
    }

    else if(od.type.name === "Audiobook"){
        for(const f of od.formats){
            if(f.name.includes("MP3 audiobook")){
		formatInfo = f;
		format = "MP3";
		duration = f.duration.substr(0, f.duration.lastIndexOf(":")).replace(/^0/,"");
                break;
            }
        }
    }

    if(formatInfo.isbn != null)
        isbn = formatInfo.isbn;

    if(formatInfo.onSaleDateUtc != null)
        year = formatInfo.onSaleDateUtc.substring(0,4);

    const r = [format, duration, isbn, year];
    return r;
}


function getTags(od){
    const tags = new Set();
    for(const subject of od.subjects){
        let tag = subject.name;
	
	if(!tag.includes("Science Fiction")){
	    if(/([ |(]Fiction)/.test(tag))
		tags.add("Fiction");
            else if(/([ |(]Nonfiction)/.test(tag))
		tags.add("Nonfiction");
	}

        tag = tag.replace("Humor (Nonfiction)","Humor")
            .replace("Humor (Fiction)","Humor")
            .replace("Biography & Autobiography","Biography")
            .replace("Cooking & Food","Food")
            .replace("Health & Fitness","Health")
            .replace("Comic and Graphic Books","Comic")
            .replace("Study Aids & Workbooks","Study Aids")
            .replace("Gay/Lesbian","lgbtq")
            .replace("Psychiatry & Psychology","Psychology")
            .replace("Travel Literature","Travel");

        if(tag === "Science Fiction & Fantasy" ||
	   tag === "Family & Relationships" ||
           tag === "Religion & Spirituality" ||
           tag === "Sports & Recreations" ||
	   tag === "Sports & Recreations" ||
	   tag.includes("Foreign Language") ||
           tag.includes("Non-English Fiction")){continue;}
        else if(tag.includes("African American")){tag = "African American";}
        tags.add(tag);
    }

    const tagsStr = Array.from(tags).join(", ").toLowerCase();
    return tagsStr;
}


async function fillUploadPage(){
    if (performance.navigation.type == 1) {return;} //reloaded page

    document.getElementById("TitleField").value = await GM.getValue("title");
    document.getElementById("AuthorsField").value = await GM.getValue("authors");
    document.getElementById("EditorsField").value = await GM.getValue("editors");
    document.getElementById("ContributorsField").value = await GM.getValue("contributors");
    document.getElementById("TranslatorsField").value = await GM.getValue("translators");
    document.getElementById("PublishersField").value = await GM.getValue("publisher");
    document.getElementById("YearField").value = await GM.getValue("year");
    document.getElementById("IsbnField").value = await GM.getValue("isbn");
    document.getElementById("TagsField").value = await GM.getValue("tags");
    document.getElementById("AnonymousField").checked = await GM.getValue("anonymous");
    document.getElementById("creatorOptions").style.display = "table-row-group";
    document.getElementById("ImageField").value = await GM.getValue("imageUrl");

    const event = new Event("change"); //trigger change event manually so CodeMirror updates the textbox
    const descriptionField = document.getElementById("DescriptionField");
    descriptionField.value = await GM.getValue("description");
    descriptionField.dispatchEvent(event);

    const language = await GM.getValue("language");
    if(language != "English"){
        const languageField = document.getElementById("LanguageField");
        for(let i = 0; i < languageField.length; i++){
            if(languageField[i].text === language){
                languageField.selectedIndex = i;
                break;
            }
        }
    }

    const format = await GM.getValue("format");
    let formatField = document.getElementById("FormatField");
    for(let i = 0; i < formatField.length; i++){
        if(formatField[i].text === format){
            formatField.selectedIndex = i;
            break;
        }
    }

    const is_ebook = await GM.getValue("is_ebook");
    if(is_ebook){
        document.getElementById("RetailField").checked = true;
    }
    else{
        document.getElementById("AbridgedField").checked = await GM.getValue("abridged");
        document.getElementById("DurationField").value = await GM.getValue("duration");
        document.getElementById("NarratorsField").value = await GM.getValue("narrators");
    }
}


function createButton(od){
    const button = document.createElement("button");
    button.innerHTML = "Upload to Bibliotik";
    const buttonplace = document.getElementsByClassName("TitleDetailsHeading")[0];
    buttonplace.appendChild(button);
    button.addEventListener ("click", function() {
        parseOverDrive(od);
        if(od.type.name === "eBook"){
            window.open("https://bibliotik.me/upload/ebooks");
        }
        else if(od.type.name === "Audiobook"){
            window.open("https://bibliotik.me/upload/audiobooks");
        }
    });
}

// BIB :: GoodReads
function fixName(name) {
    return name.replace("Dr. ", "")
        .replace("Dr ", "")
        .replace(", MD", "")
        .replace(", Ph.D.", "")
        .replace(", Phd.", "")
        .replace(" Ph.D.", "")
        .replace(" USA Inc.", "")
        .replace(" DDS", "")
        .replace(" MBA", "")
        .replace(" MD", "")
        .replace(" ODD", "")
        .replace(" PhD", "")
        .replace(", M.D", "");
}


function getDescription(od) {
    let description = od.description
    description = description
        .replace(/#/gi,"\\#")
        .replace(/&\\#/gi,"&#")
        .replace(/<div>/gi, "")
        .replace(/<\/div>/gi, "")
        .replace(/<b ?>/gi,"[b]")
        .replace(/<\/ ?b ?>/gi,"[/b]")
        .replace(/<strong>/gi, "[b]")
        .replace(/<\/strong>/gi, "[/b]")
        .replace(/<blockquote>/gi, "")
        .replace(/<\/blockquote>/gi, "")
        .replace(/<p ?>/gi,"\n\n")
        .replace(/<\/p>/gi, "")
        .replace(/<p\/>/gi, "")
        .replace(/<\/ ?p ?>/gi,"\n\n")
        .replace(/<br ?>/gi,"\n\n")
        .replace(/<br ?\/ ?>/gi,"\n\n")
        .replace(/<div>/gi, "")
        .replace(/<i ?>/gi,"[i]")
        .replace(/<\/ ?i ?>/gi,"[/i]")
        .replace(/<em>/gi, "[i]")
        .replace(/<\/em>/gi, "[/i]")
        .replace(/<li ?>/gi,"\n* ")
        .replace(/<\/li ?>/gi,"")
        .replace(/• ?/gi,"* ")
        .replace(/&middot;  ?/gi,"* ")
        .replace(/<ul>/gi, "\n")
        .replace(/<\/ul>/gi, "")
        .replace(/--/gi,"—")
        .replace(/\s{3,}/gi,"\n\n")
        .trim();
    return description;
}


function decode(encodedString) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
}


if(window.location.hostname.indexOf("overdrive") >= 0 ){
    const od = unsafeWindow.OverDrive.titleCollection;
    if(od.type.name =="eBook"){GM.setValue("is_ebook",true);}
    else{GM.setValue("is_ebook",false);}
    createButton(od);
}

if(window.location.hostname.indexOf("bibliotik") >= 0 ){
    if(document.referrer.indexOf("overdrive") >= 0 ){
        fillUploadPage();
    }
}

