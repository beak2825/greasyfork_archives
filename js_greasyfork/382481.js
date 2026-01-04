// ==UserScript==
// @name         Faction items shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Faction items shortcuts for better life... :p
// @author       Jox [1714547]
// @match        https://www.torn.com/factions.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382481/Faction%20items%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/382481/Faction%20items%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Add items you want to use as quick items
    var items = [39, 180, 87, 17, 731];

    //Start script
    start();

    function start(){
        //Create container div for widget
        var container = document.createElement('div');
        container.id = 'JoxDiv';
        container.classList.add('faction-main-wrap');

        //Create header
        var header = document.createElement('div');
        header.classList.add('title-black', 'm-top10', 'title-toggle', 'active');
        header.innerHTML = 'Faction Quick Items'

        //Create body
        var body = document.createElement('div');
        body.classList.add('cont-gray10', 'bottom-round', 'cont-toggle', 'unreset');
        body.style.display = 'flex';
        body.style.flexWrap = 'wrap';

        //Add header and body elements
        container.appendChild(header);
        container.appendChild(body);

        //Add items
        for(var i in items){
            body.appendChild(createItem(items[i]));
        }

        //Add message container
        var msgContainer = document.createElement('div');
        msgContainer.id = "JoxMsgContainer";
        msgContainer.classList.add('cont-gray10', 'bottom-round');
        msgContainer.style.backgroundColor = '#e6e6e6';
        msgContainer.style.borderTop = '1px solid #cdcdcd';
        msgContainer.style.marginTop = '-5px';
        msgContainer.style.display = 'none';
        container.appendChild(msgContainer);

        //Add div to page
        insertAfter(container, document.querySelector('.content-title'));
    }

    function createItem(itemID){
        //Create item container
        var itemContainer = document.createElement('div');
        itemContainer.dataset.item = itemID;
        itemContainer.style.display = 'flex';
        itemContainer.style.cursor = 'pointer';
        itemContainer.style.backgroundColor = '#fafafa';
        itemContainer.style.margin = '5px 5px 0px 0px';
        itemContainer.style.padding = '5px 10px';
        itemContainer.style.border = '1px solid #cccccc'
        itemContainer.style.borderRadius = '5px';


        //Add item image
        var itemImage = document.createElement('img');
        itemImage.src = `/images/items/${itemID}/medium.png`;
        itemImage.dataset.item = itemID;

        //Add image to container
        itemContainer.appendChild(itemImage);

        //Register event
        itemContainer.addEventListener('click', useItem);

        //return created element
        return itemContainer;
    }

    function useItem(e){

        e.preventDefault();

        //Get item id from clicked element
        var item = e.target.dataset.item;

        //Find faction armoury div (torn event is attacked to this element, so to triger item usage elements must be inside this element)
        var factionArmoury = document.getElementById('faction-armoury');

        //Container for item that will use so I can later find it and remove it
        var itemUseContainer = document.createElement('div');
        itemUseContainer.id = `JoxItemUseDiv${item}`;
        itemUseContainer.style.display = 'none'; //For debugging comment this line

        //This structore must be created for evnet to triger
        //this selector is used on #faction-armoury '.armoury-tabs .use-cont .confirm-wrap .next-act'
        var armouryTabs = document.createElement('div');
        armouryTabs.classList.add('armoury-tabs');
        var itemList = document.createElement('ul');
        itemList.classList.add('item-list');
        var itemUseAct = document.createElement('li');
        itemUseAct.classList.add('item-use-act');
        var qty = document.createElement('span');
        qty.classList.add('qty');
        qty.innerHTML = '9999'; //Always have some quantity (torn check for quantity before server call)
        var useCont = document.createElement('div');
        useCont.classList.add('use-cont');
        var confirmWrap = document.createElement('div');
        confirmWrap.classList.add('confirm-wrap');
        var nextAct = document.createElement('a'); //this element is used to triger event and from it item data is used and infor from where to take item (faction or itmes)
        nextAct.classList.add('next-act');
        nextAct.dataset.item = item; //item witch to use
        nextAct.dataset.fac = 1 //use 0 from items 1 from faction (add checkbox maybe???)
        //nextAct.innerHTML = 'click me'; //for debugging
        var useWrap = document.createElement('div');
        useWrap.classList.add('use-wrap', 'msg'); //this is where response from server is returned

        //adding all elements to create DOM tree
        itemUseContainer.appendChild(armouryTabs);
        armouryTabs.appendChild(itemList);
        itemList.appendChild(itemUseAct);
        itemUseAct.appendChild(qty);
        itemUseAct.appendChild(useCont);
        useCont.appendChild(confirmWrap);
        useCont.appendChild(useWrap);
        confirmWrap.appendChild(nextAct);

        //Adding all my container to faction armoury so it can be trigered
        factionArmoury.appendChild(itemUseContainer);
        //factionArmoury.style.display = 'block'; //For debugging

        //creating observer to look for respons of item usage
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.addedNodes.length > 0){ //if new node is added message is recived
                    var msg = useWrap.querySelector('form p'); //getting first part of message (second part contain links for other action that I dont need)
                    msg = fixWrongMsg(msg); //in some cases (like when no item in faction) wrong messages are returned

                    var close = document.createElement('a');
                    close.href = '#';
                    close.classList.add('close-act', 't-blue', 'h');
                    close.innerHTML = 'Close';
                    close.addEventListener('click', function(e){
                        e.target.parentNode.style.display = 'none';
                    })

                    var msgContainer = document.getElementById('JoxMsgContainer'); //Getting container for message to display
                    msgContainer.innerHTML = '' //Clearing old messages
                    msgContainer.appendChild(msg); //Adding message
                    msgContainer.appendChild(close); //Adding close action
                    msgContainer.style.display = 'block';

                    itemUseContainer.parentNode.removeChild(itemUseContainer); //removing element that i added before to #faction-armoury
                    observer.disconnect(); //stopping observer
                }
            });
        });

        // configuration of the observer:
        var config = { childList: true };
        // pass in the target node, as well as the observer options
        observer.observe(useWrap, config); //Start observing

        nextAct.click(); //Trigger action
    }

    //Helper function to fix wrong messages
    function fixWrongMsg(msg){
        //If message start with You're full up and timer is 00:00:00 there is not itme in faction armoury
        if(msg.textContent.match("You're full up. You'll have to wait") && msg.querySelector('.counter-wrap') && msg.querySelector('.counter-wrap').innerHTML == '00:00:00'){
            msg.innerHTML = 'This item is not in faction armoury';
        }
        return msg;
    }

    //Helper function for more readability
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
})();