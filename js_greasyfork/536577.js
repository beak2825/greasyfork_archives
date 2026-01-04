// ==UserScript==
// @name         Bypass unsafeflink
// @namespace    Natalie
// @version      1.1
// @description  Navigate to manga sites with selected numbers and bypass unsafelink popups
// @match        *://*/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536577/Bypass%20unsafeflink.user.js
// @updateURL https://update.greasyfork.org/scripts/536577/Bypass%20unsafeflink.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let menuWindow = null;
  let selectedNumber = '';
  let showTimer = null;
  const hitomiSites = [
    {name: 'hitomi', url: 'https://hitomi.la/doujinshi/'},
    {name: 'k-hentai', url: 'https://k-hentai.org/r/'},
    {name: 'litomi', url: 'https://litomi.vercel.app/manga/'}
  ];
  
  const rjSites = [
    {name: 'DLsite', url: 'https://www.dlsite.com/maniax/work/=/product_id/'},
    {name: 'asmr.one', url: 'https://asmr.one/work/'},
    {name: 'hentai-sharing', url: 'https://hentai-sharing.net/?s='},
    {name: 'japaneseasmr', url: 'https://japaneseasmr.com/?s='},
    {name: 'hvdb.me', url: 'hvdb'}
  ];
  
  const base64Sites = [
    {name: '디코딩 URL로 이동', url: ''}
  ];

  function isValidHitomiNumber(text) {
    return /^\d{6,7}$/.test(text);
  }
  
  function isValidRJNumber(text) {
    return /^RJ\d{6,8}$/i.test(text);
  }
  
  function isBase64(text) {
    return /^[A-Za-z0-9+/=]+$/.test(text) && text.length % 4 === 0;
  }
  
  function recursiveBase64Decode(base64Text, maxDepth = 10) {
    if (maxDepth <= 0) return null;
    
    try {
      const decodedText = atob(base64Text);
      
      if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
        if (decodedText.includes('unsafelink.com/')) {
          return decodedText.replace(/https?:\/\/unsafelink\.com\//, '');
        }
        return decodedText;
      }
      
      if (isBase64(decodedText)) {
        const recursiveResult = recursiveBase64Decode(decodedText, maxDepth - 1);
        if (recursiveResult) return recursiveResult;
      }
      
      return null;
    } catch (e) {
      console.error('Base64 디코딩 에러:', e);
      return null;
    }
  }
  
  function processHvdbUrl(rjNumber) {
    let numberPart = rjNumber.substring(2);
    
    if (numberPart.length === 8 && numberPart.startsWith('0')) {
      numberPart = numberPart.replace(/^0+/, '');
    }
    
    return `https://hvdb.me/Dashboard/WorkDetails/${numberPart}`;
  }
  
  function processUnsafelink(url) {
    if (url.includes('unsafelink.com/')) {
      return url.replace(/https?:\/\/unsafelink\.com\//, '');
    }
    return url;
  }

  function createMenuWindow(sites) {
    if (menuWindow) {
      while (menuWindow.firstChild) {
        menuWindow.removeChild(menuWindow.firstChild);
      }
    } else {
      menuWindow = document.createElement('div');
      menuWindow.style.cssText = `position:fixed;padding:5px;background:rgba(40,40,40,0.97);border:1px solid rgba(70,70,70,0.5);border-radius:5px;z-index:999999;display:none;user-select:none;pointer-events:auto;box-shadow:0 4px 8px rgba(0,0,0,0.3);left:auto;top:0;backdrop-filter:blur(3px);`;
      menuWindow.addEventListener('mousedown', e => e.stopPropagation());
      document.body.appendChild(menuWindow);
    }
    
    sites.forEach(site => {
      const button = document.createElement('div');
      button.style.cssText = `color:#e0e0e0;padding:8px 15px;margin:5px 0;cursor:pointer;border-radius:3px;font-size:14px;transition:all 0.2s;pointer-events:auto;`;
      button.textContent = site.name;
      button.addEventListener('mouseover', () => {
        button.style.background = 'rgba(80,80,80,0.8)';
        button.style.color = '#ffffff';
      });
      button.addEventListener('mouseout', () => {
        button.style.background = 'transparent';
        button.style.color = '#e0e0e0';
      });
      button.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (selectedNumber) {
          let url;
          if (sites === base64Sites) {
            url = recursiveBase64Decode(selectedNumber);          } else if (isValidHitomiNumber(selectedNumber)) {
            url = site.url + selectedNumber + (site.name === 'k-hentai' ? '#1' : (site.name === 'litomi' ? '/hi' : '.html'));
          } else if (isValidRJNumber(selectedNumber)) {
            if (site.url === 'hvdb') {
              url = processHvdbUrl(selectedNumber);
            } else {
              url = site.url + selectedNumber + (site.name === 'DLsite' ? '.html' : '');
            }
          }
          
          if (url) {
            url = processUnsafelink(url);
            window.open(url, '_blank');
          }
        }
        hideMenu();
      });
      button.addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
      });
      menuWindow.appendChild(button);
    });
    
    return menuWindow;
  }

  function showMenu(rect, text) {
    selectedNumber = text;
    let sitesToUse;
    
    if (isValidHitomiNumber(text)) {
      sitesToUse = hitomiSites;
    } else if (isValidRJNumber(text)) {
      sitesToUse = rjSites;
    } else if (isBase64(text) && recursiveBase64Decode(text)) {
      sitesToUse = base64Sites;
    } else {
      return;
    }
    
    const menu = createMenuWindow(sitesToUse);
    menu.style.display = 'block';
    
    let finalLeft = rect.left + 35;
    let finalTop = rect.bottom + 5;
    
    const menuWidth = menu.offsetWidth || 100;
    const menuHeight = menu.offsetHeight || 100;
    const maxRight = document.documentElement.clientWidth - 10;

    if (finalLeft + menuWidth > maxRight) {
      finalLeft = maxRight - menuWidth;
    }
    
    finalLeft = Math.max(10, finalLeft);
    
    if (finalTop + menuHeight > window.innerHeight - 10) {
      finalTop = rect.top - menuHeight - 5;
    }
    
    menu.style.left = `${finalLeft}px`;
    menu.style.top = `${finalTop}px`;
  }

  function hideMenu() {
    if (menuWindow) {
      menuWindow.style.display = 'none';
    }
  }

  document.addEventListener('selectionchange', () => {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const text = selection.toString().trim();
    hideMenu();
    
    if (text && (isValidHitomiNumber(text) || isValidRJNumber(text) || (isBase64(text) && recursiveBase64Decode(text)))) {
      showTimer = setTimeout(() => {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        showMenu(rect, text);
      }, 500);
    }
  });

  document.addEventListener('click', e => {
    if (menuWindow && menuWindow.style.display === 'block' && !menuWindow.contains(e.target)) {
      hideMenu();
    }
  });

  document.addEventListener('scroll', () => {
    hideMenu();
  });

  
  if (window.location.hostname.includes('unsafelink.com')) {
    const currentUrl = window.location.href;
    const originalUrl = currentUrl.replace(/https?:\/\/unsafelink\.com\//, '');
    if (originalUrl !== currentUrl) {
      window.location.href = originalUrl;
    }
  } else {
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.href && e.target.href.includes('unsafelink.com')) {
        e.preventDefault();
        e.stopPropagation();
        const originalUrl = e.target.href.replace(/https?:\/\/unsafelink\.com\//, '');
        window.open(originalUrl, e.target.target || '_blank');
      }
    }, true);
    
    if (window.location.hostname.includes('arca.live')) {
      const processAllLinks = () => {
        document.querySelectorAll('a[href*="unsafelink.com"]').forEach(link => {
          const originalUrl = link.href.replace(/https?:\/\/unsafelink\.com\//, '');
          link.href = originalUrl;
          link.setAttribute('data-processed', 'true');
          link.removeAttribute('onclick');
          link.removeAttribute('target');
        });
      };
      
      const handlePopups = () => {
        const popups = document.querySelectorAll('div.microModal.is-open');
        popups.forEach(popup => {
          if (popup.textContent.includes('unsafelink.com') || 
              popup.textContent.includes('외부 사이트로 이동합니다')) {
            const moveButton = popup.querySelector('button.danger');
            if (moveButton) {
              moveButton.click();
            } else {
              popup.remove();
            }
          }
        });
      };
      
      const observer = new MutationObserver((mutations) => {
        let needToProcessLinks = false;
        let needToHandlePopups = false;
        
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) {
                if (node.tagName === 'A' || node.querySelector('a')) {
                  needToProcessLinks = true;
                }
                
                if (node.classList && 
                    (node.classList.contains('microModal') || 
                     node.querySelector('.microModal'))) {
                  needToHandlePopups = true;
                }
              }
            }
          }
        });
        
        if (needToProcessLinks) {
          processAllLinks();
        }
        
        if (needToHandlePopups) {
          setTimeout(handlePopups, 50);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'class']
      });
      
      processAllLinks();
      
      window.addEventListener('load', () => {
        setTimeout(handlePopups, 100);
      });
      
      setInterval(handlePopups, 500);
    }
  }
})();