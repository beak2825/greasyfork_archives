// ==UserScript==
// @name         ava hider
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  hides annoying cunts
// @author       anon
// @match        https://discordapp.com/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28305/ava%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/28305/ava%20hider.meta.js
// ==/UserScript==

blockedusers = ["ava"];
//add more users like so: ["ava", "ava2", "ava3"];

members = [];
var style;
var textcolor;
var newdiv = null;

function hideblocked(item){
    item.style.display = "none";
}
var a = setInterval(function(){
    var target = document.querySelector(".messages-wrapper");
    if (target == null){
        return 0;
    }
    if (document.querySelector(".member-username") == null){
        return 0;
    }
    if (document.querySelector(".connecting") != null){
        return 0;
    }
    target = target.parentElement;
    var b = document.querySelector(".messages");
    b = b.children;
    var dividerindex = -1;
    var blockedgroups = 0;
    var totalgroups = 0;
    for(i=0; i<b.length; i++){
        var classname = b[i].className;
        if (classname.includes("blocked")){
            hideblocked(b[i]);
        }
        else if (classname.includes("divider-red")){
            dividerindex = i;
        }
        if(dividerindex >= 0){
            if (classname.includes("blocked")){
                blockedgroups += 1; totalgroups += 1;
            }else if (classname.includes("message-group")){
                totalgroups +=1;
            }
        }
        
    }
    if (blockedgroups == totalgroups && dividerindex > -1){
            b[dividerindex].style.display = "none";
    }else if (blockedgroups < totalgroups && dividerindex > -1){
        var messagesbar = document.querySelector(".new-messages-bar");
        if (messagesbar != null){
            var el = messagesbar.children[0];
            var text = el.innerText;
            text = text.split(' ');
            text[0] = totalgroups - blockedgroups;
            text = text.join(' ');
            el.innerText = text;
        }
    }
        
    clearInterval(a);
    getmemberroles();

                                         
    // create an observer instance
    var target = document.querySelector(".messages-wrapper");
    var observer = new MutationObserver(function(mutations) {
        //ava hider
        var b = document.querySelector(".messages");
        b = b.children;
        var dividerindex = -1;
        var blockedgroups = 0;
        var totalgroups = 0;
        for(i=0; i<b.length; i++){
            var classname = b[i].className;
            if (classname.includes("blocked")){
                hideblocked(b[i]);
            }
            else if (classname.includes("divider-red")){
                dividerindex = i;
            }
            if(dividerindex >= 0){
                if (classname.includes("blocked")){
                    blockedgroups += 1; totalgroups += 1;
                }else if (classname.includes("message-group")){
                    totalgroups +=1;
                }
            }
            
        }
        if (blockedgroups == totalgroups && dividerindex > -1){
                b[dividerindex].style.display = "none";
        }else if (blockedgroups < totalgroups && dividerindex > -1){
            var messagesbar = document.querySelector(".new-messages-bar");
            if (messagesbar != null){
                var el = messagesbar.children[0];
                var text = el.innerText;
                text = text.split(' ');
                text[0] = totalgroups - blockedgroups;
                text = text.join(' ');
                el.innerText = text;
            }
        }
        
    });
    var config = { subtree: true, childList: true, characterData: false };
    observer.observe(target, config);
    

    var target1 = document.querySelector(".channel-text-area-default").parentElement;
    var observer1 = new MutationObserver(function(mutations){
        
        var typing = document.querySelector(".messages-wrapper").nextSibling.querySelector(".typing");
        if (typing != null){
            if(document.querySelector('.messages-wrapper').nextSibling.nextSibling == null){
                newdiv = typing.cloneNode(true);
                newdiv.id = 'typingdiv';
                textcolor = window.getComputedStyle(typing.querySelector(".text")).color;
                document.querySelector(".channel-text-area-default").parentElement.parentElement.appendChild(newdiv);
            }
            newdiv.style.display = '';
            newdiv.querySelector('.text').style.color = textcolor;
            style = window.getComputedStyle(typing);
            newdiv.style = style;
            newdiv.className = typing.className;  
            typing.style.display = "none";

            var fulltext = typing.children[1].innerHTML;
            var phrases = [];
            var phrasesparsed = [];
            var word = '';
            var openbrackets = 0;
            var slashes = 0;
            for(var n = 0; n<fulltext.length;n++){
                if (fulltext[n] == "<"){
                    openbrackets += 1;
                    word += fulltext[n];
                }
                else if (fulltext[n] == "/"){
                    word += fulltext[n];
                    slashes += 1;
                    openbrackets -= 1;
                }
                
                else if (fulltext[n] == ">"){
                    word += fulltext[n];
                    if (slashes == openbrackets){
                        phrases.push(word);
                        word = '';
                        slashes = 0;
                        openbrackets = 0;
                    }
                }
                else{
                    word += fulltext[n];
                }
            }
            for (let phrase of phrases){
                phrasesparsed.push(phrase.replace(/(<([^>]+)>)/ig, ''));
            }
            fulltext = fulltext.match(/(<([^>]+)>)/ig, '');
            var userstyping = typing.children[1].children;
            var names = [];
            for (i=0; i<userstyping.length; i++){
                var name = userstyping[i].innerText;
                names.push(name);
                userstyping[i].name = name;
                
            }
            var outtext = removeblockedfromtyping(phrasesparsed,names, phrases);
            if (outtext != null){
                document.getElementById('typingdiv').children[1].innerHTML = outtext;    
            }
        }
        else if (typing == null && newdiv != null){ // typing == null;
            document.getElementById('typingdiv').style.display = 'none';

        }
        
    });
    var config = {childList : true, subtree: true};
    observer1.observe(target1,config);


    // to stop observing
    //observer.disconnect();
},50);

function getmemberroles(){
    var looplength = 0;
    var membersscroller = document.querySelector(".channel-members");
    var a = setInterval(function(){
        var mems = document.querySelectorAll(".member");
        if (members.length > 0){
            if(mems[mems.length-1] == members[members.length-1]){
                looplength += 1;
                if (looplength > 10){
                    clearInterval(a);
                }
                return 0;
            }
        }
        clearInterval(a);
        var readytoscroll = 1;
        for(var i = 0; i < mems.length; i++){
            if (members.indexOf(mems[i]) < 0){
                mem = mems[i];
                
                try{
                    res = getnickandusername(mem);
                    mem.nickname = res[0];
                    mem.username = res[1];

                    for (let user of blockedusers){
                        if (mem.username == user){
                            blockedusers[blockedusers.indexOf(user)] = mem;
                            mem.style.display = 'none';
                        }
                    }
                    members.push(mem);
                }
                catch(err){
                    readytoscroll = 0;
                }
            }
        }
        if (readytoscroll == 0){
            setTimeout(getmemberroles(),25);
            return 0;
        }
        var diff = membersscroller.scrollHeight - membersscroller.scrollTop - membersscroller.clientHeight;
        //if(membersscroller.scrollHeight - membersscroller.scrollTop > membersscroller.clientHeight + 200){
        if (diff >= 1){
            //membersscroller.scrollTop += 600;
            membersscroller.scrollTop += Math.max(diff, 600) -1;
            setTimeout(getmemberroles(),25);
        }
        else{
            //membersscroller.click();
            membersscroller.scrollTop = 0;
            var config = { childList: true};
            var target2 = document.querySelector(".channel-members");
            observer2.observe(target2, config);
        }
    },20);
}
function removeblockedfromtyping(parsedphrases, names, phrases){
    var outnames = names;
    var outarr = [];
    var typing = document.querySelector(".typing");
    typing = typing.nextSibling;
    for (var i = 0; i < blockedusers.length;i++){
        for (var n = 0; n < names.length; n++){
            var name = names[n];
            var user = blockedusers[i];
            if (name == user.username || name == user.nickname){
                outnames.splice(outnames.indexOf(name),1);
            }
        }
    }
    for (var i = 0; i < outnames.length; i++){
        outarr.push(phrases[phrases.length - 1-(i*2)]);
        outarr.push(phrases[parsedphrases.indexOf(outnames[outnames.length - 1 - i])]);
        
    }
    if (outarr.length == 2){
        try{outarr[0].replace(" are "," is ");}catch(err){}
    }
    if (outnames.length == 0){
        document.getElementById("typingdiv").style.display = "none";
        return null;
    }
    else if (outnames.length > 0){
        document.getElementById("typingdiv").style.display = 'flex';
    }
    outarr.reverse();

    return outarr.join("");
}
target2 = document.querySelector(".channel-members");
observer2 = new MutationObserver(function(mutations) {
    target = mutations[0].target;
    mems = target.querySelectorAll('.member');
    for (var i = 0; i < mems.length; i++){
        for (var n = 0; n < blockedusers.length; n++){
            mem = mems[i];
            res = getnickandusername(mem);
            mem.nickname = res[0];
            mem.username = res[1];
            
            user = blockedusers[n];
            if (mem.username == user.username){
                mem.style.display = 'none';
            }
            
        }
    }
});
function randcolour(n, m){
    //var n = 55;
    //var m = 255;
    var out = "rgb(";
    var col1 = Math.floor((Math.random() * m) + n); //gets random colour between n and m
    var col2 = Math.floor((Math.random() * m) + n);
    var col3 = Math.floor((Math.random() * m) + n);
    out += col1 + ',';
    out += col2 + ',';
    out += col3;
    out += ")";
    return out;
}

function colourname(uname){
    var parent = uname.parentElement;
    var last = parent.lastChild;
    var style1 = document.defaultView.getComputedStyle(uname);
    innertext = uname.innerText;
    var backcolour = randcolour(25,55);
    for (var i = 0; i < innertext.length;i++){
        letter = innertext[i];
        var el = document.createElement('strong');
        el.style = style1;
        el.style.marginRight = "0px";
        el.style.display = "inline";
        el.style.color = randcolour(55,255);
        el.innerText = letter;
        el.className = "user-name";
        el.style.backgroundColor = backcolour;
        if (i == innertext.length-1){
            el.style.marginRight = '5px';
        }
        parent.insertBefore(el, last);
        
    }
    uname.innerText = "";
}

const getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];

function getOwnerInstance(e, {include, exclude=["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
    if (e === undefined) {
        return undefined;
    }


    // Set up filter; if no include filter is given, match all except those in exclude
    const excluding = include === undefined;
    const filter = excluding ? exclude : include;

    // Get displayName of the React class associated with this element
    // Based on getName(), but only check for an explicit displayName
    function getDisplayName(owner) {
        const type = owner._currentElement.type;
        const constructor = owner._instance && owner._instance.constructor;
        //alert(type, type.displayName, constructor, constructor.displayName);
        return type.displayName || constructor && constructor.displayName || null;
    }
    // Check class name against filters
    function classFilter(owner) {

        const name = getDisplayName(owner);
        return (name !== null && !!(filter.includes(name) ^ excluding));
    }
    // Walk up the hierarchy until a proper React object is found
    for (let prev, curr=getInternalInstance(e); !_.isNil(curr); prev=curr, curr=curr._hostParent) {
        // Before checking its parent, try to find a React object for prev among renderedChildren
        // This finds React objects which don't have a direct counterpart in the DOM hierarchy
        // e.g. Message, ChannelMember, ...

        if (prev !== undefined && !_.isNil(curr._renderedChildren)) {
            /* jshint loopfunc: true */
            let owner = Object.values(curr._renderedChildren)
            .find(v => !_.isNil(v._instance) && v.getHostNode() === prev.getHostNode());
            if (!_.isNil(owner) && classFilter(owner)) {

                return owner._instance;
            }
        }

        if (_.isNil(curr._currentElement)) {
            continue;
        }

        // Get a React object if one corresponds to this DOM element
        // e.g. .user-popout -> UserPopout, ...
        let owner = curr._currentElement._owner;
        if (!_.isNil(owner) && classFilter(owner)) {
            return owner._instance;
        }
    }

    return null;
}

function getInternalProps(e) {
    if (e === undefined) {
        return undefined;
    }

    try {
        return getOwnerInstance(e).props;
    } catch (err) {
        return undefined;
    }
}

function getmessageauthorid(e) {
    var props = getInternalProps(e);
    if (props != undefined){
        var author = props.message.author;
        var id = author.id;
        
    }
    
}
function getuserfrommember(e){
    var user = getInternalProps(e).user;
    var username = user.username;
    return username;
    
}

function getnickandusername(e){
    var props = getInternalProps(e);
    nickname = props.nick;
    var username = props.user.username;
    return [nickname, username];
}


observer3 = new MutationObserver(function(mutations) {
    var newguild = document.querySelector(".guild.selected");

    if (newguild !== prevguild){
        members = [];
       try{
            getmemberroles();
        }
        catch(err){

        }

       prevguild = newguild;
    }
    observemessagearea();
    observetypingarea();
});

function mesrap(){
    prevguild = document.querySelector(".guild.selected");
    mesrapp = document.querySelectorAll(".flex-spacer.flex-vertical")[2];
}

var d = setInterval(function(){
    var target = document.querySelector(".flex-spacer.flex-vertical");

    if (target == null){
        return 0;
    }
    if (document.querySelector(".member-username") == null){
        return 0;
    }
    if (document.querySelector(".guild") ==null){
        return 0;
    }
    clearInterval(d);
    
    var config = { childList: true, attributes: true, subtree:true, characterData:true};
    var target2 = document.querySelector(".chat").children[1];
    mesrap();
    serverarea = document.querySelectorAll(".flex-spacer.flex-vertical")[2];
    observer3.observe(serverarea, {subtree:false,attributes:true, childList: true, characterData:true});
    
},50);
leftserverview = 0;
var checkbackinserver = setInterval(function(){
    var target = document.querySelector(".flex-spacer.flex-vertical");

    if ((target == null) || (document.querySelector(".member-username") == null)){
        if(leftserverview == 0){
            leftserverview = 1;
        }
        return 0;
    }

    if (leftserverview == 1){
        mesrap();
        serverarea = document.querySelectorAll(".flex-spacer.flex-vertical")[2];
        observer3.observe(serverarea, {subtree:false,attributes:true, childList: true, characterData:true});
        
        var newguild = document.querySelector(".guild.selected");
        members = [];
       try{
            getmemberroles();
        }
        catch(err){
        }

        prevguild = newguild;
        observemessagearea();
        observetypingarea();
        leftserverview = 0;
    }

}, 50);

function processmessagearea(mutations){
        var b = document.querySelector(".messages");
        b = b.children;
        var dividerindex = -1;
        var blockedgroups = 0;
        var totalgroups = 0;
        for(i=0; i<b.length; i++){
            var classname = b[i].className;
            if (classname.includes("blocked")){
                hideblocked(b[i]);
            }
            else if (classname.includes("divider-red")){
                dividerindex = i;
            }
            if(dividerindex >= 0){
                if (classname.includes("blocked")){
                    blockedgroups += 1; totalgroups += 1;
                }else if (classname.includes("message-group")){
                    totalgroups +=1;
                }
            }
            
        }
        if (blockedgroups == totalgroups && dividerindex > -1){
                b[dividerindex].style.display = "none";
        }else if (blockedgroups < totalgroups && dividerindex > -1){
            var messagesbar = document.querySelector(".new-messages-bar");
            if (messagesbar != null){
                var el = messagesbar.children[0];
                var text = el.innerText;
                text = text.split(' ');
                text[0] = totalgroups - blockedgroups;
                text = text.join(' ');
                el.innerText = text;
            }
        }
    }
function observemessagearea(){
    
    processmessagearea(null);

    var target = document.querySelector(".messages-wrapper");
    var observer = new MutationObserver(function(mutations) {
        processmessagearea(mutations);
        
    });
    var config = { subtree: true, childList: true, characterData: false };
    observer.observe(target, config);
}

function processtypingarea(mutations){
    var typing = document.querySelector(".messages-wrapper").nextSibling.querySelector(".typing");
    if (typing != null){
        if(document.querySelector('.messages-wrapper').nextSibling.nextSibling == null){
            newdiv = typing.cloneNode(true);
            newdiv.id = 'typingdiv';
            textcolor = window.getComputedStyle(typing.querySelector(".text")).color;
            document.querySelector(".channel-text-area-default").parentElement.parentElement.appendChild(newdiv);
        }
        newdiv.style.display = '';
        newdiv.querySelector('.text').style.color = textcolor;
        style = window.getComputedStyle(typing);
        newdiv.style = style;
        newdiv.className = typing.className;  
        typing.style.display = "none";

        var fulltext = typing.children[1].innerHTML;
        var phrases = [];
        var phrasesparsed = [];
        var word = '';
        var openbrackets = 0;
        var slashes = 0;
        for(var n = 0; n<fulltext.length;n++){
            if (fulltext[n] == "<"){
                openbrackets += 1;
                word += fulltext[n];
            }
            else if (fulltext[n] == "/"){
                word += fulltext[n];
                slashes += 1;
                openbrackets -= 1;
            }
            
            else if (fulltext[n] == ">"){
                word += fulltext[n];
                if (slashes == openbrackets){
                    phrases.push(word);
                    word = '';
                    slashes = 0;
                    openbrackets = 0;
                }
            }
            else{
                word += fulltext[n];
            }
        }
        for (let phrase of phrases){
            phrasesparsed.push(phrase.replace(/(<([^>]+)>)/ig, ''));
        }
        fulltext = fulltext.match(/(<([^>]+)>)/ig, '');
        var userstyping = typing.children[1].children;
        var names = [];
        for (i=0; i<userstyping.length; i++){
            var name = userstyping[i].innerText;
            names.push(name);
            userstyping[i].name = name;
            
        }
        var outtext = removeblockedfromtyping(phrasesparsed,names, phrases);
        if (outtext != null){
            document.getElementById('typingdiv').children[1].innerHTML = outtext;    
        }
    }
    else if (typing == null && newdiv != null){ // typing == null;
        document.getElementById('typingdiv').style.display = 'none';

    }

}

var typingobserver = new MutationObserver(function(mutations){
        
        processtypingarea(mutations);
        
    });

function observetypingarea(){
    var target1 = document.querySelector(".channel-text-area-default").parentElement;
    
    var config = {childList : true, subtree: true};
    typingobserver.observe(target1,config);

}