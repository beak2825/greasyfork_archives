// ==UserScript==
// @name         a11yInsta
// @namespace    https://github.com/geanCarneiro/WebAcessivel
// @version      0.4
// @description  Script criado pra tornar o Instagram mais acessível
// @author       Gean G. Carneiro
// @match        https://www.instagram.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_xmlhttpRequest
// @connect      github.com
// @connect      githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/481444/a11yInsta.user.js
// @updateURL https://update.greasyfork.org/scripts/481444/a11yInsta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
             
        
        

        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(mutation => {
                if(mutation.type == 'childList') {
                    mutation.addedNodes.forEach(node => {
                        updatePost(node)
                    })
                }
            })
        })
        

        waitForElm('main div[style] > div > div:nth-of-type(2) > div').then(elem => {
            let postsArea = elem.querySelector('article[class]')
            postsArea = postsArea.parentNode;

            observer.observe(postsArea, {childList: true})
        })

        
  /*
        window .addEventListener(
            "keydown",
            ( @type {KeyboardEvent}    evt) => {
                 @type {Node} 
                let post = evt.target

                let focusTarget;

                // controles das publicações
                if(post.tagName == 'ARTICLE'){
                    if(evt.altKey && evt.key.toLowerCase() == "l"){
                        evt.preventDefault()
                        evt.stopPropagation()
                        
                        let botaoCurtir = post.querySelector('svg[aria-label="Curtir"]');
                        let curtir = botaoCurtir != null
                        if(!curtir) 
                            botaoCurtir = post.querySelector('svg[aria-label="Descurtir"]')

                        botaoCurtir = botaoCurtir != null ? botaoCurtir.parentNode : null
                        botaoCurtir = botaoCurtir != null ? botaoCurtir.parentNode : null
                        botaoCurtir = botaoCurtir != null ? botaoCurtir.parentNode : null
                        botaoCurtir != null ? botaoCurtir.click() : null
                        if(botaoCurtir != null)
                            curtir ? notifyScreenReader('curtiu') : notifyScreenReader('descurtiu')

                    }
                }
                // controle gerais
                if(evt.altKey && evt.key.toLowerCase() == "f"){
                    evt.preventDefault()
                    evt.stopPropagation()
                    
                    let feedTitle = document.querySelector('#feedTitle');
                    feedTitle != null ? feedTitle.focus() : null
                }
                
        
            }, false
        ) */

        // garantir a primeira execução dos metodos
        insertTitles()
        updateAllPost()
        fixDoubleSemantic()
    }
    
    function fixDoubleSemantic(){
        let instagramLink = document.querySelector('a[class][href="/"]');
        instagramLink.ariaLabel = 'Instagram'
        
        let instagramImg = instagramLink.querySelector('[role="img"]')
        instagramImg.ariaHidden = 'true'

        let menu = document.querySelector('span[aria-describedby]').parentNode.parentNode.parentNode;
        menu.querySelectorAll('svg').forEach(graph => {
            graph.ariaHidden = 'true'
        })

    }
    

    function insertTitles(){
        // insert Post Title
        waitForElm('main div[style] > div > div:nth-of-type(2) > div').then(elem => {
            let postsArea = elem.querySelector('article[class]')
            postsArea = postsArea.parentNode.parentNode;

            createTitleIn(2, 'Feed', postsArea, 'feedTitle')
        })
      

        // insert Stories Title
        waitForElm('main [role="menu"] [role="presentation"]').then(storiesArea => {
            storiesArea = storiesArea.parentNode;

            createTitleIn(2, 'Stories', storiesArea)
        })


        // set Instagram as tittle
        createTitleIn(1, 'Instagram', document.body)
    }

    function notifyScreenReader(msg){
        let ariaLive = getAriaLiveElement();
        ariaLive.textContent = msg;
        setTimeout(() => {
            ariaLive.textContent = '';
        }, 1000)
    }

    function getAriaLiveElement(){
        let ariaLive = document.querySelector('#aria-live-elem')
        if (!ariaLive) {
            ariaLive = document.createElement('span');
            ariaLive.id = 'aria-live-elem'
            ariaLive.setAttribute('aria-live', 'assertive')
            document.body.appendChild(ariaLive)
        }
        return ariaLive;
    }

    function updateAllPost() {
        let posts = document.querySelector('main div[style] > div > div:nth-of-type(2) > div').querySelectorAll('article[class]')

        posts.forEach(post => {
            updatePost(post)
        });
    }

    function updatePost(post){
        
        let postOwner = post.querySelector('div > div:nth-of-type(1) span[dir] a span[dir]');
        postOwner = postOwner.textContent;

        createTitleIn(3, 'publicação de ' + postOwner, post)
        post.tabIndex = "0"


        if(!post.querySelector('section').parentNode.querySelector('article')){
            let pivot = post.querySelector('section');
            let textElem = pivot.nextSibling;

            let sectionElem = document.createElement('article');
            sectionElem.tabIndex = '-1'

            pivot.after(sectionElem)
            sectionElem.appendChild(textElem)
        }

        let botoesLink = post.querySelectorAll('[role="button"]');
            botoesLink.forEach(botaoLink => {
                let img = botaoLink.querySelector('[role="img"]');
                if(img) {
                    img.ariaHidden = 'true'
                    botaoLink.ariaLabel = img.ariaLabel
                }
            })

        

        let botaoCompartilhar = post.querySelector('button');
        if(botaoCompartilhar){
        let img = botaoCompartilhar.querySelector('[role="img"]');
            if(img) {
                img.ariaHidden = 'true'
                botaoCompartilhar.ariaLabel = img.ariaLabel
            }
        }
    }

    function createTitleIn(titleLevel, text, elemParent, id = null){
        if(!elemParent.querySelector('h' + titleLevel)){
            let title = document.createElement('h' + titleLevel)
            title.style.width = '0'
            title.style.height = '0'
            title.style.overflow = 'hidden'
            if (id != null) {
                title.id = id
                title.tabIndex = '0'
            }
            title.textContent = text
            elemParent.prepend(title)
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();
