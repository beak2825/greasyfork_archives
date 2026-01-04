// ==UserScript==
// @name         Text Filter
// @namespace    mailto:kalobkalob@yahoo.com
// @version      1.1
// @description  For the following sites, this will allow you to auto-filter selected text.
// @author       You
// @match        https://www.fanfiction.net/s/*
// @match        https://forums.sufficientvelocity.com/threads/*
// @match        https://forums.spacebattles.com/threads/*
// @match        https://forum.questionablequesting.com/threads/*
// @match        https://www.tthfanfic.org/Story*
// @match        https://www.tthfanfic.org/wholestory*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/411286/Text%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/411286/Text%20Filter.meta.js
// ==/UserScript==

/* Version 1.1 changelog
 * Fixed bug where the filter doesn't work with the last line of the story. It now accounts for null.
 * Fixed bug that didn't account for different font tags in one paragraph.
 * Added a console log that tracks every deletion. Please report if this shows a problem.
*/

class Page {
    constructor(){
        console.clear();
        GM_registerMenuCommand("XFilter Selected", ()=>this.deleteSelected(), 'x');
        this.storyChildElements = window.location.pathname.split('/')[1]=="wholestory.php";
        this.location = window.location.host.split('.')[1];
        this.storyClassName = {
            fanfiction:"storytext xcontrast_txt nocopy",
            questionablequesting:"messageText SelectQuoteContainer ugc baseHtml",
            tthfanfic:"paragraphs",
            spacebattles:"bbWrapper",
            sufficientvelocity:"bbWrapper"
        }
        this.storyNodes = this.getStoryContainer();
    }
    tagFilter(target){
        return target.filter((b,i)=>{
            if(b.tagName=="BR"||b.tagName=="IMG"||b.textContent==""||b.textContent.trim().length==0)return false;
            return true;
        });
    }
    getStoryContainer(){
        var cont=document.getElementsByClassName(this.storyClassName[this.location]);
        var nodes = [];
        var subElements = [];
        for(let i=0,len=cont.length;i<len;i++){
            if(this.storyChildElements){
                subElements = [...cont[i].childNodes];
                subElements.pop();
                for(let j=0,lenj=subElements.length;j<lenj;j++){
                    nodes=[...nodes,...this.tagFilter([...subElements[j].childNodes])];
                }
            } else {
                nodes=[...nodes,...this.tagFilter([...cont[i].childNodes])];
            }
            //if(this.storyChildElements) subElements=subElements[i].childNodes;
        }
        return nodes;
    }
    deleteSelected(){
        this.deleteTargets(this.getSelectionText());
    }
    deleteTargets(target){
        console.clear();
        if(target){
            var toCheck = [];
            var outputString = "";
            for(let i=0, len=this.storyNodes.length;i<len;i++){
                if(this.storyNodes[i].tagName){
                    toCheck=[];
                    outputString = "";
                    if(this.storyNodes[i].nextSibling==null){
                        console.log("NULL PROBLEM!!!",this.storyNodes[i]);
                    }else{
                        if(this.storyNodes[i].childNodes[0].tagName==undefined){
                            while(this.storyNodes[i].nextSibling.tagName!="BR"){
                                toCheck.push(this.storyNodes[i]);
                                outputString += this.storyNodes[i].textContent;
                                i++;
                                if(this.storyNodes[i].previousSibling==null)break;//console.log(i,"prev",this.storyNodes[i],this.storyNodes[i].previousSibling);
                            }
                        }
                        toCheck.push(this.storyNodes[i]);
                        outputString += this.storyNodes[i].textContent;
                        if(this.checkText(outputString,target)){
                            toCheck.forEach(e=>{
                                this.deleteTarget(e);
                            });
                            console.log("deleting",{storyText:outputString,selectedText:target});
                            i-=toCheck.length-1;
                            len-=toCheck.length;
                            this.storyNodes.splice(i,toCheck.length);
                        }
                    }
                } else {
                    if(this.checkText(this.storyNodes[i].textContent,target)){
                        this.deleteTarget(this.storyNodes[i]);
                        console.log("deleting",{storyText:this.storyNodes[i],selectedText:target});
                        this.storyNodes.splice(i,1);
                        i--;
                        len--;
                    }
                }
            }
        }
    }
    deleteTarget(target){
        while(true){
            let nextSib=target.nextSibling;
            if(nextSib==null)break;
            if(nextSib.tagName=="HR"||nextSib.tagName=="BR"||nextSib.textContent==""||nextSib.textContent.trim().length==0){
                this.deleteElement(target.nextSibling);
            }else{
                break;
            }
        }
        this.deleteElement(target);
    }
    deleteElement(target){
        target.parentNode.removeChild(target);
    }
    checkText(text, target){
        return ~text.toLowerCase().indexOf(target);
    }
    getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text.toLowerCase().trim();
    }
}

var page = new Page();