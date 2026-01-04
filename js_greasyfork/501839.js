// ==UserScript==
// @name         Bloomberg Minimalism
// @version      2
// @description  Breaks pretty much all of the Bloomberg website except the article content, allowing you to read in peace
// @match        https://www.bloomberg.com/*
// @namespace https://greasyfork.org/users/1340127
// @downloadURL https://update.greasyfork.org/scripts/501839/Bloomberg%20Minimalism.user.js
// @updateURL https://update.greasyfork.org/scripts/501839/Bloomberg%20Minimalism.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const story = JSON.parse(
        document.querySelector( '#__NEXT_DATA__' ).innerHTML
    ).props.pageProps.story


    function render( block ){

        if( block.type == 'text' ){
            return document.createTextNode( block.value )

        }else{

            const el = document.createElement(
                {
                    document: 'main',
                    headline: 'h1',
                    heading: 'h2',
                    paragraph: 'p',
                    quote: 'blockquote',
                    link: 'a',
                    story: 'a',
                    ordered: 'ol',
                    unordered: 'ul',
                    listItem: 'li',
                    footnotes: 'ol',
                    footnote: 'li',
                    photo: 'img',
                    footnoteRef: 'a',
                }[ block.subType || block.type ] || 'div'
            )

            if([ 'ad', 'inline-recirc', 'inline-newsletter' ].includes( block.type )){
               return el
            }

            if( el.tagName == 'DIV' ){
                console.log( 'Unknown block', block )
            }

            if( block.type == 'link' ){
                el.href = block.data['data-web-url'] || block.data.href
            }

            if( block.subType == 'story' ){
                el.href = block.data.link.destination.web
            }

            if( block.subType == 'photo' ){
                el.src = block.data.photo.src
            }

            if( block.type == 'footnote' ){
                el.id = block.data.identifier
            }

            if( block.type == 'footnoteRef' ){
                el.href = `#${block.data.identifier}`
                block.content = [{ type: 'text', value: `[${block.data.identifier}]` }]
            }

            for( const child of block.content || [] ){
                el.append( render(child) )
            }

            return el
        }

    }


    const style = document.createElement("style")
    style.textContent = `
        body {
            background: #000;
            color: #edc;
            font: 32px / 1.4 sans-serif;
            margin: 1em auto;
            max-width: 30em;
        }
        h2 {
            font-size: inherit;
            margin-block: 3em 1em;
        }
        a {
            color: #fec;
        }
        blockquote {
            border-left: thin solid;
            margin-left: 0;
            padding-left: 1em;
        }
        li {
            margin-block: 1em;
        }
        img {
            max-width: 100%;
        }
    `


    document.write() // clear the page
    document.close()
    document.body.replaceChildren(
        render({ type: 'document', content: [
            { type: 'headline', content: [{ type: 'text', value: story.headline }] },
            { type: 'p', content: [{ type: 'text', value: story.summaryText }] },
            ...story.body.content,
            ...story.footnotes.content,
        ] })
    )
    document.head.replaceChildren( style )


})();