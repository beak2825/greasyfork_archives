// ==UserScript==
// @name        NRS Readability
// @namespace   com.maltera
// @match       *://www.leg.state.nv.us/nrs/*
// @version     1
// @grant       none
// @description Reformats the official Nevada Law site.
// @downloadURL https://update.greasyfork.org/scripts/28127/NRS%20Readability.user.js
// @updateURL https://update.greasyfork.org/scripts/28127/NRS%20Readability.meta.js
// ==/UserScript==

try {
(function(){
  /** Normalizes the whitespace in a string.
   * The site likes to use non-breaking spaces and other nonsense to
   * do their formatting. Since we impose actual structure we need
   * to get rid of them or it looks awful.
   */
  function normSpace (text) {
    return text
      .replace(/\u00A0/g, " ") // non-breaking space
      .replace(/\t/g, " ");
  }


  function visitNode (node) {
    if (node instanceof CharacterData && !(node instanceof Comment)) {
      return document.createTextNode( normSpace( node.data ) );
    } else if (node instanceof Element) {
      return visitElement( node );
    } else {
      return node;
    }
  }

  function visitElement (elem) {
    // The page uses Wingdings to render an arrow. Not everyone has
    // Wingdings and that arrow is in Unicode now, so replace it with
    // the Unicode version in a span with an identifying class.
    if ('SPAN' === elem.tagName
        && '"Wingdings 3"' === elem.style.fontFamily
        && elem.childNodes.length === 1
        && elem.firstChild instanceof Text
        && '\u00CA' == elem.firstChild.data.trim()) {
      let span = document.createElement( 'span' );
      span.className = 'arrow-then';
      span.textContent = '\u2BA9';
      return span;
    }

    filterChildren( elem );
    return elem;
  }

  function filterChildren (elem) {
    for (let child of elem.childNodes) {
      let result = visitNode( child );
      if (result !== child) {
        elem.replaceChild( result, child );
      }
    }
  }

  function moveChildren (source, dest) {
    while (source.childNodes.length > 0) {
      let child = source.childNodes[ 0 ];
      child.remove();
      dest.appendChild( visitNode( child ) );
    }
  }


  function stripPrefix (node, prefix) {
    let text = node.childNodes[ 0 ];
    if (!(text instanceof CharacterData)) return;

    let value = normSpace( text.data ).trimLeft();
    if (value.startsWith( prefix )) {
      node.replaceChild( document.createTextNode(
        value.substring( prefix.length ).trimLeft()
      ), text );
    }
  }

  let root = document.querySelector(".WordSection1");
  root.remove();

  let fragment = document.createDocumentFragment();
  let chapter = null;
  let section = null;
  let numbers = null;
  let letters = null;
  let subnumbers = null;
  let container = fragment;

  while (root.childNodes.length > 0) {
    let part = root.firstChild;
    part.remove();

    if (!( part instanceof Element )) {
      container.appendChild( part );
      continue;
    }

    if (part.classList.contains( 'Chapter' )) {
      section = null;
      numbers = null;
      letters = null;
      subnumbers = null;

      chapter = document.createElement( 'section' );
      chapter.className = 'chapter';
      fragment.appendChild( chapter );

      let anchor = part.querySelector( 'a[name]' );
      if (anchor) {
        anchor.remove();
        chapter.id = anchor.name;
      }

      let header = document.createElement( 'header' );
      chapter.appendChild( header );

      let heading = document.createElement( 'h1' );
      moveChildren( part, heading );
      header.appendChild( heading );

      container = document.createElement( 'nav' );
      header.appendChild( container );

      let tochead = document.createElement( 'h2' );
      tochead.textContent = 'Table of Contents'
      container.appendChild( tochead );
    } else if (chapter && part.classList.contains( 'COLeadline' )) {
      let entry = document.createElement( 'div' );
      moveChildren( part, entry );
      container.appendChild( entry );
    } else if (chapter && part.classList.contains( 'COHead2' )) {
      let heading = document.createElement( 'h3' );
      moveChildren( part, heading );
      container.appendChild( heading );
    } else if (chapter && part.classList.contains( 'J-Dash' )) {
      // ignore; we replace this with CSS
    } else if (chapter && part.classList.contains( 'SectBody' )) {
      // p.SectBody is nearly all content


      // if this paragraph contans a span.Section it's a section heading
      // start an new section and convert this paragraph to an h3
      if (part.querySelector( ".Section" )) {
        numbers = null;
        letters = null;
        subnumbers = null;

        section = document.createElement( 'section' );
        section.className = 'section';
        chapter.appendChild( section );
        container = section;

        let heading = document.createElement( 'h3' );
        section.appendChild( heading );

        let paragraph = document.createElement( 'p' );

        // first move all known header elements to the new h3
        while (part.childNodes.length > 0) {
          let child = part.childNodes[ 0 ];

          if (!(child instanceof Element) || (
              !child.classList.contains('Empty')
              && !child.classList.contains('Section')
              && !child.classList.contains('Leadline'))) {
            break;
          }

          child.remove();
          filterChildren( child );
          heading.appendChild( child );
        }

        // then move everything else to a new paragraph
        // this is necessary because when the body of a section is not an outline
        // the first body paragraph follows the heading in the same <p> tag
        moveChildren( part, paragraph );
        if (paragraph.childNodes.length > 0) {
          section.appendChild( paragraph );
        }


        let anchor = heading.querySelector( 'a[name]' );
        if (anchor) {
          anchor.remove();
          section.id = anchor.name;
        }

      // if this is not a section header but we're in a section
      // handle the current paragraph as body content and detect outline level
      } else if (section) {
        let text = normSpace( part.textContent ).trimLeft();
        let match;

        if (match = /^([0-9]+)\./.exec( text )) {
          if (!numbers) {
            numbers = document.createElement( 'ol' );
            numbers.setAttribute( 'type', '1' );
            section.appendChild( numbers );
          }

          letters = null;
          subnumbers = null;

          let item = document.createElement( 'li' );
          item.setAttribute( 'value', parseInt( match[1] ) );
          numbers.appendChild( item );
          container = item;

          let paragraph = document.createElement( 'p' );
          moveChildren( part, paragraph );
          stripPrefix( paragraph, match[0] );
          item.appendChild( paragraph );
        } else if (match = /^\(([a-z]+)\)/.exec( text )) {
          if (!letters) {
            letters = document.createElement( 'ol' );
            letters.setAttribute( 'type', 'a' );
            container.appendChild( letters );
          }

          subnumbers = null;

          let item = document.createElement( 'li' );
          item.setAttribute( 'value', match[1] );
          letters.appendChild( item );
          container = item;

          let paragraph = document.createElement( 'p' );
          moveChildren( part, paragraph );
          stripPrefix( paragraph, match[0] );
          item.appendChild( paragraph );
        } else if (match = /^\(([0-9]+)\)/.exec( text )) {
          if (!subnumbers) {
            subnumbers = document.createElement( 'ol' );
            subnumbers.setAttribute( 'type', '1' );
            container.appendChild( subnumbers );
          }

          let item = document.createElement( 'li' );
          item.setAttribute( 'value', parseInt( match[1] ) );
          subnumbers.appendChild( item );
          container = item;

          let paragraph = document.createElement( 'p' );
          moveChildren( part, paragraph );
          stripPrefix( paragraph, match[0] );
          item.appendChild( paragraph );
        } else {
          let paragraph = document.createElement( 'p' );
          moveChildren( part, paragraph );
          container.appendChild( paragraph );
        }

      // if we don't have a current section and this isn't a section header
      // treat it as general body conent and move it over unchanged
      } else {
        container.appendChild( part );
      }
    } else if (part.classList.contains( 'SourceNote' ) && section) {
      let footer = document.createElement( 'footer' );
      moveChildren( part, footer );
      section.appendChild( footer );
    } else if (part.classList.contains( 'DocHeading' )) {
      section = null;
      numbers = null;
      letters = null;
      subnumbers = null;
      container = chapter || fragment;

      let heading = document.createElement( 'h2' );
      moveChildren( part, heading );
      container.appendChild( heading );
    } else {
      chapter = null;
      section = null;
      numbers = null;
      letters = null;
      subnumbers = null;
      container = fragment;

      fragment.appendChild( part );
    }
  }


  // The pages often use an arrow to mean "then" at the end of a list
  // of conditions. In `visitElement` we clean up the way they render
  // the arrow and give it an identifying class so we can find it here.
  // The structure-building algorithm will make the paragraph with the
  // arrow part of the list item that immediately precedes it, so it'll
  // almost always be too deep in the hierarchy. Here we move it to
  // the same level of hierarchy as the *following* list item, which
  // seems to be a good heuristic.
  for (let arrow of fragment.querySelectorAll( '.arrow-then' )) {
    let paragraph = arrow.parentElement;
    if ('P' !== paragraph.tagName) {
      console.warn( 'NRS Readability found arrow outside paragraph' );
      continue;
    }

    let child = paragraph;
    let parent = child.parentElement;
    up: while ('LI' === parent.tagName) {
      let sibling = parent.nextSibling;
      right: while (sibling) {
        // if the containing LI has an LI as a following sibling we've
        // found the level of hierarchy at which the arrow should land
        if ('LI' === sibling.tagName) {
          break up;
        }

        sibling = sibling.nextSibling;
      }

      // if there was no LI in the following siblings,
      // jump up to our LI's parent OL and try again
      child = parent.parentElement;
      parent = child.parentElement;
    }

    parent.insertBefore( paragraph, child.nextSibling );
  }


  (function(){
    // remove all existing stylesheets; they just make everything awful
    for (let style of document.getElementsByTagName( 'style' )) {
      style.remove();
    }

    let style = document.createElement( 'style' );
    style.type = "text/css";
    style.textContent = (
      'p, h3 { max-width: 78ex; }'
      + '.chapter > header > nav {'
      +   'font-size: 80%;'
      +   'background: #EEE;'
      +   'padding: 1ex;'
      + '}'
      + '.chapter > header > nav > h2 {'
      +   'margin-top: 0;'
      + '}'
      + '.section > footer {'
      +   'font-size: 50%;'
      +   'color: #888;'
      + '}'
      + '.section > footer a         { color: #77F; }'
      + '.section > footer a:active  { color: #F77; }'
      + '.section > footer a:visited { color: #97C; }'
    );
    document.head.appendChild( style );
  })();

  document.body.appendChild( fragment );
  console.info( "NRS Readability finished" );
})();
} catch (caught) {
  console.error( "NRS Readability failed", caught );
}
