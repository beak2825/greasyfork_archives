// ==UserScript==
// @name     		TopAreaNav
// @namespace   top.areaNav
// @version  		1.2.2
// @description Moves the Area Navigation Menu to the top
// @grant    		none
// @run-at   		document-end
// @match    		https://www.torn.com/*
// @author   		AndersAngstrom [3690608]
// @license  		Private to AndersAngstrom [3690608] – cannot be used or duplicated in any form
// @icon     		https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/535614/TopAreaNav.user.js
// @updateURL https://update.greasyfork.org/scripts/535614/TopAreaNav.meta.js
// ==/UserScript==


(() => {
  'use strict';
  
  // Configuration options
  const config = {
    scrollAmount: 400,       // Pixels to scroll on arrow click
    arrowWidth: '24px',      // Width of navigation arrows
    arrowColor: 'white',     // Color of arrow text
    borderColor: '#000',     // Border color between nav elements
    buttonBgColor: '#222', // Background color for arrow buttons
    safetyTimeout: 10000,    // Maximum time to wait for elements before stopping observation (ms)
    stickyPosition: 'top',   // Where to stick the navigation ('top' or 'bottom')
    stickyZIndex: 999,       // Z-index for sticky navigation
    stickyBackground: '#222', // Background color for sticky navigation
    toggleBtnColor: '#222', // Background color for toggle button
    toggleTextColor: 'white', // Text color for toggle button
    storageKey: 'topAreaNavSticky' // Local storage key to remember the toggle state
  };
  
  // Get the toggle state from localStorage or default to enabled
  const isNavigationEnabled = () => {
    const storedValue = localStorage.getItem(config.storageKey);
    return storedValue === null ? true : storedValue === 'true';
  };
  
  // Toggle the navigation state
  const toggleNavigation = (stickyWrapper) => {
    const currentState = isNavigationEnabled();
    const newState = !currentState;
    
    // Update local storage
    localStorage.setItem(config.storageKey, newState);
    
    // Update UI
    if (stickyWrapper) {
      updateNavigationVisibility(stickyWrapper, newState);
    }
    
    return newState;
  };
  
  // Update the visibility of the navigation based on state
  const updateNavigationVisibility = (stickyWrapper, isEnabled) => {
    if (isEnabled) {
      // Enable sticky navigation
      stickyWrapper.style.position = 'sticky';
      stickyWrapper.classList.add('torn-nav-sticky');
    } else {
      // Disable sticky navigation but keep visible when scrolled to top
      stickyWrapper.style.position = 'static';
      stickyWrapper.classList.remove('torn-nav-sticky');
    }
    
    // Update toggle button text if it exists
    const toggleBtn = document.getElementById('torn-nav-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = isEnabled ? '📌' : '📍';
      toggleBtn.title = isEnabled ? 'Unpin' : 'Pin';
    }
  };
  
  // Create "Go to Top" button
	const createGoToTopButton = () => {
  	const goToTopBtn = document.createElement('button');
  	goToTopBtn.id = 'torn-nav-top-btn';
  	goToTopBtn.setAttribute('type', 'button');
  	goToTopBtn.setAttribute('aria-label', 'Go to top of page');
  	goToTopBtn.title = 'Go to top of page';
  
  	// Style the button
  	Object.assign(goToTopBtn.style, {
    	cursor: 'pointer',
    	width: '50px',
    	height: '42px',
    	padding: '0',
    	margin: '0 0 0 4px',
    	//backgroundColor: config.buttonBgColor,
    	border: 'none',
    	borderRadius: '4px',
    	display: 'inline-flex',
    	alignItems: 'center',
    	justifyContent: 'center',
    	userSelect: 'none',
    	backgroundImage: 'url(https://www.torn.com/images/v2/svg_icons/globals/go_to_top.svg)',
      backgroundPosition: '-4px -4px',
      backgroundRepeat: 'no-repeat',
      filter: 'invert(100%) brightness(50%)',
    	opacity: '1',
      cursor: 'not-allowed',
  	});
  
  	// Add click event listener
  	goToTopBtn.addEventListener('click', () => {
      if (window.scrollY > 300) {
    		window.scrollTo({
      		top: 0,
      		behavior: 'smooth'
         });
       }
  	});
  
  	// Show/hide button based on scroll position
  	window.addEventListener('scroll', () => {
    	if (window.scrollY > 300) {
      	//goToTopBtn.style.opacity = '1';
      	goToTopBtn.style.backgroundPosition = '-4px -54px';
        goToTopBtn.style.filter = 'invert(100%) brightness(100%)';
        goToTopBtn.style.cursor = 'pointer';
    	} else {
      	goToTopBtn.style.backgroundPosition = '-4px -4px';
        goToTopBtn.style.filter = 'invert(100%) brightness(50%)';
      	goToTopBtn.style.cursor = 'not-allowed';
    	}
  	}, { passive: true });
  
  	return goToTopBtn;
	};
  
  // Create the UI components once the target element is found
  const setupNavigationUI = () => {
    const wrapper = document.querySelector('.areasWrapper');
    if (!wrapper) return false;
    
    const content = wrapper.querySelector('.toggle-content___BJ9Q9');
    if (!content) return false;
    
    // Clone the original content
    const clonedContent = content.cloneNode(true);
    
    // Style the cloned content container
    Object.assign(clonedContent.style, {
      display: 'flex',
      overflowX: 'auto', // 'auto' is more cross-browser compatible than 'scroll'
      width: '100%',
      flex: '1',
      msOverflowStyle: 'none', // IE and Edge
      scrollbarWidth: 'thin', // Firefox
      WebkitOverflowScrolling: 'touch' // Smooth scrolling for iOS Safari
    });
    
    //Clone the "Go to Top" Button
    const goTop = document.querySelector('#go-to-top-btn-root')
    if (!goTop) return false;
    
    const goToTopBtn = createGoToTopButton();
    
    // Hide the scrollbar in WebKit browsers while keeping functionality
    clonedContent.classList.add('custom-scrollbar');
    
    // Style all navigation elements
    const navElements = clonedContent.querySelectorAll('[id^="nav-"]');
    navElements.forEach(nav => {
      Object.assign(nav.style, {
        flex: '0 0 auto',
        width: 'auto',
        height: 'auto',
        boxSizing: 'border-box',
        borderRight: `2px solid ${config.borderColor}`
      });
      
      // Style area rows
      const areaRow = nav.querySelector('[class^="area-row"]');
      if (areaRow) {
        areaRow.style.borderRadius = '0';
        
        // Style desktop links
        const desktopLink = areaRow.querySelector('.desktopLink___SG2RU');
        if (desktopLink) {
          desktopLink.style.flexDirection = 'column';
          desktopLink.style.padding = '8px';
        }
      }
    });
    
    // Create parent container with flex layout
    const parentContainer = document.createElement('div');
    Object.assign(parentContainer.style, {
      position: 'relative',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 0',
      boxSizing: 'border-box'
    });
    
    // Create outer wrapper for sticky positioning
    const stickyWrapper = document.createElement('div');
    Object.assign(stickyWrapper.style, {
      width: '100%',
      backgroundColor: config.stickyBackground,
      padding: '4px 10px',
      boxSizing: 'border-box'
    });
    
    // Apply sticky positioning based on current toggle state
    const isEnabled = isNavigationEnabled();
    Object.assign(stickyWrapper.style, {
      width: '100%',
      backgroundColor: config.stickyBackground,
      padding: '4px 10px',
      boxSizing: 'border-box',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      zIndex: config.stickyZIndex.toString(),
      [config.stickyPosition]: '0'
    });
    
    if (isEnabled) {
      stickyWrapper.style.position = 'sticky';
      stickyWrapper.classList.add('torn-nav-sticky');
    } else {
      stickyWrapper.style.position = 'static';
    }
    
    // Create navigation arrows with improved styling
    const createArrowButton = (text, direction) => {
      // Use button for semantic correctness but also create a div for Safari compatibility
      const button = document.createElement('button');
      button.setAttribute('type', 'button'); // Explicitly set type for accessibility
      button.setAttribute('aria-label', direction < 0 ? 'Scroll left' : 'Scroll right');
      button.textContent = text;
      
      // Apply styles that work across browsers
      Object.assign(button.style, {
        cursor: 'pointer',
        height: '100%',
        width: config.arrowWidth,
        color: config.arrowColor,
        backgroundColor: config.buttonBgColor,
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        fontSize: '24px',
        fontWeight: 'bold',
        userSelect: 'none',      // Prevent text selection
        WebkitUserSelect: 'none', // Safari
        MozUserSelect: 'none',    // Firefox
        msUserSelect: 'none',     // IE/Edge
        webkitAppearance: 'none', // Remove default styling in WebKit browsers
        appearance: 'none'        // Remove default styling in modern browsers
      });
      
      // Add click event listener
      button.addEventListener('click', () => {
        // Cross-browser smooth scrolling
        if ('scrollBehavior' in document.documentElement.style) {
          // Modern browsers that support smooth scrolling
          clonedContent.scrollBy({
            left: direction * config.scrollAmount,
            behavior: 'smooth'
          });
        } else {
          // Fallback for browsers that don't support ScrollToOptions with behavior
          smoothScrollPolyfill(clonedContent, direction * config.scrollAmount);
        }
      });
      
      return button;
    };
    
    // Create left and right navigation buttons
    const leftArrow = createArrowButton('◀', -1);
    const rightArrow = createArrowButton('▶', 1);
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'torn-nav-toggle';
    toggleBtn.textContent = isEnabled ? '📌' : '📍';
    toggleBtn.title = isEnabled ? 'Unpin' : 'Pin';
    toggleBtn.setAttribute('type', 'button');
    toggleBtn.setAttribute('aria-label', 'Toggle sticky navigation');
    
    // Style the toggle button
    Object.assign(toggleBtn.style, {
      cursor: 'pointer',
      padding: '8px',
      margin: '0 0 0 4px',
      backgroundColor: config.toggleBtnColor,
      color: config.toggleTextColor,
      border: 'none',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      userSelect: 'none',      // Prevent text selection
      WebkitUserSelect: 'none', // Safari
      MozUserSelect: 'none',    // Firefox
      msUserSelect: 'none',     // IE/Edge
    });
    
    // Add click event listener to toggle button
    toggleBtn.addEventListener('click', () => {
      toggleNavigation(stickyWrapper);
    });
    
    // Create a container for right-side elements (right arrow + toggle button)
    const leftSideContainer = document.createElement('div');
    Object.assign(leftSideContainer.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    });
    
    leftSideContainer.appendChild(goToTopBtn);
    leftSideContainer.appendChild(leftArrow);
    
    const rightSideContainer = document.createElement('div');
    Object.assign(rightSideContainer.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    });
    
    rightSideContainer.appendChild(rightArrow);
    rightSideContainer.appendChild(toggleBtn);
    
    
    // Assemble the components
    parentContainer.appendChild(leftSideContainer);
    parentContainer.appendChild(clonedContent);
    parentContainer.appendChild(rightSideContainer);
    
    stickyWrapper.appendChild(parentContainer);
    
    // Add the custom navigation to the page
    const targetElement = document.querySelector('.content');
    if (targetElement) {
      // Add the stickyWrapper to the page
      targetElement.insertAdjacentElement('beforebegin', stickyWrapper);
      
      // Hide the original wrapper and go-to-btn to avoid duplication
      wrapper.style.display = 'none';
      goTop.style.display = 'none';
      
      // Add scroll tracking to enhance sticky visual effect
      const handleScroll = () => {
        if (window.scrollY > 10) {
          stickyWrapper.classList.add('scrolled');
        } else {
          stickyWrapper.classList.remove('scrolled');
        }
      };
      
      // Add scroll event listener with performance optimization
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
      
      // Initial call to set the correct state
      handleScroll();
      
      // Add touch swipe support for mobile browsers
      let touchStartX = 0;
      let touchEndX = 0;
      
      clonedContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      clonedContent.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
      
      const handleSwipe = () => {
        const swipeThreshold = 100; // Minimum distance for a swipe
        if (touchEndX < touchStartX - swipeThreshold) {
          // Swipe left, scroll right
          rightArrow.click();
        } else if (touchEndX > touchStartX + swipeThreshold) {
          // Swipe right, scroll left
          leftArrow.click();
        }
      };
      
      return true;
    }
    
    return false;
  };
  
  // Polyfill for smooth scrolling in browsers that don't support scrollBy with behavior option
  const smoothScrollPolyfill = (element, amount) => {
    const startTime = performance.now();
    const startScrollLeft = element.scrollLeft;
    const duration = 300; // Duration of animation in milliseconds
    
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        // Easing function - easeInOutQuad
        let progress = elapsedTime / duration;
        progress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const newScrollLeft = startScrollLeft + amount * progress;
        element.scrollLeft = newScrollLeft;
        
        window.requestAnimationFrame(animateScroll);
      } else {
        // Ensure we end at the exact destination
        element.scrollLeft = startScrollLeft + amount;
      }
    };
    
    window.requestAnimationFrame(animateScroll);
  };
  
  // Add custom CSS to the page
  const addCustomStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide scrollbar while maintaining functionality - cross-browser approach */
      .custom-scrollbar {
        scrollbar-width: thin; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
      .custom-scrollbar::-webkit-scrollbar {
        height: 4px; /* Chrome, Safari, newer versions of Opera */
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #222;
      }
      /* For older browsers and Safari - hide scrollbar visually */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        .custom-scrollbar {
          overflow-y: overlay;
        }
      }
      
      /* Sticky navigation styles */
      @supports ((position: -webkit-sticky) or (position: sticky)) {
        .torn-nav-sticky {
          position: -webkit-sticky;
          position: sticky;
          top: 0;
          z-index: 999;
        }
      }
      
      /* Transition effects for sticky state */
      .torn-nav-sticky {
        transition: box-shadow 0.3s ease;
      }
      .torn-nav-sticky.scrolled {
        box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      }
      
      /* Responsive adjustments */
      @media screen and (max-width: 768px) {
        .torn-nav-toggle-btn {
          display: block !important;
        }
      }
      
      /* Toggle button styles */
      #torn-nav-toggle {
        transition: background-color 0.2s ease;
      }
      
      #torn-nav-toggle:hover {
        background-color: #333333;
      }
      
      /* Highlight when navigation is sticky */
      #torn-nav-toggle.active {
        box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
      }
    `;
    document.head.appendChild(style);
  };
  
  // Use a more efficient observer setup with safety timeout
  const setupObserver = () => {
    // Add custom styles first
    addCustomStyles();
    
    // Feature detection for MutationObserver
    const MutationObserverImpl = window.MutationObserver || 
                                window.WebKitMutationObserver || 
                                window.MozMutationObserver;
    
    if (!MutationObserverImpl) {
      console.warn('Torn Navigation Enhancer: MutationObserver not supported. Falling back to interval check.');
      // Fallback for older browsers that don't support MutationObserver
      const checkInterval = setInterval(() => {
        if (setupNavigationUI()) {
          clearInterval(checkInterval);
          console.log('Torn Navigation Enhancer: Navigation UI created through interval check');
        }
      }, 500);
      
      // Safety timeout to avoid infinite checking
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Torn Navigation Enhancer: Timed out waiting for elements');
      }, config.safetyTimeout);
      
      return;
    }
    
    // Create an observer instance
    const observer = new MutationObserverImpl((mutations, obs) => {
      if (setupNavigationUI()) {
        // Disconnect observer once the navigation is set up
        obs.disconnect();
        console.log('Torn Navigation Enhancer: Navigation UI successfully created');
      }
    });
    
    // Safety timeout to prevent infinite observation
    const safetyTimer = setTimeout(() => {
      observer.disconnect();
      console.warn('Torn Navigation Enhancer: Timed out waiting for elements');
    }, config.safetyTimeout);
    
    // Start observing with optimized settings
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    // Attempt to set up navigation immediately in case the elements are already loaded
    if (setupNavigationUI()) {
      clearTimeout(safetyTimer);
      observer.disconnect();
      console.log('Torn Navigation Enhancer: Navigation UI created immediately');
    }
  };
  
  // Check browser compatibility and initialize the script
  const isBrowserCompatible = () => {
    // Feature detection for essential features
    const hasQuerySelector = !!document.querySelector;
    const hasEventListener = !!window.addEventListener;
    const hasCreateElement = !!document.createElement;
    
    return hasQuerySelector && hasEventListener && hasCreateElement;
  };
  
  // Run the script only if browser is compatible
  if (isBrowserCompatible()) {
    // Handle older browsers that don't have console.log
    if (typeof console === 'undefined') {
      window.console = { 
        log: function(){},
        warn: function(){},
        error: function(){}
      };
    }
    
    // Wait for DOM to be ready in a cross-browser way
    if (document.readyState === 'loading') {
      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', setupObserver);
      } else {
        window.attachEvent('onload', setupObserver);
      }
    } else {
      // DOM already loaded
      setupObserver();
    }
  } else {
    // Log error for incompatible browsers
    if (window.console && console.error) {
      console.error('Torn Navigation Enhancer: Your browser lacks required features to run this script.');
    }
  }
})();
