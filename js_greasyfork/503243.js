// ==UserScript==
// @name           Greasyfork Dark Theme
// @name:en        Greasyfork Dark Theme
// @name:vi        Giao diện chủ đề tối Greasyfork
// @name:zh-CN     Greasyfork 暗黑主题
// @name:zh-TW     Greasyfork 暗黑主題
// @name:ja        Greasyfork ダークテーマ
// @name:ko        Greasyfork 다크 테마
// @name:es        Greasyfork 테마 어두움
// @name:ru        Темная тема Greasyfork
// @name:id        Tema Gelap Greasyfork
// @name:hi        Greasyfork डार्क थीम
// @namespace      http://tampermonkey.net/
// @version        1.8.2
// @description    A sleek and modern dark theme for Greasyfork.
// @description:en A sleek and modern dark theme for Greasyfork.
// @description:vi Giao diện chủ đề tối cho Greasyfork.
// @description:zh-CN 为 Greasyfork 打造的时尚现代暗黑主题。
// @description:zh-TW 為 Greasyfork 打造的時尚現代暗黑主題。
// @description:ja Greasyfork の洗練されたモダンなダークテーマ。
// @description:ko Greasyfork를 위한 세련되고 현대적인 다크 테마。
// @description:es Un tema oscuro elegante y moderno para Greasyfork.
// @description:ru Изящная и современная темная тема для Greasyfork с улучшенными визуальными эффектами и удобочитаемостью.
// @description:id Tema gelap yang ramping dan modern untuk Greasyfork, dengan visual dan keterbacaan yang ditingkatkan.
// @description:hi Greasyfork के लिए एक आकर्षक और आधुनिक डार्क थीम, जिसमें बेहतर विजुअल और पठनीयता है।
// @author         RenjiYuusei
// @license        GPL-3.0-only
// @icon           https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @match          https://greasyfork.org/*
// @match          https://sleazyfork.org/*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503243/Greasyfork%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/503243/Greasyfork%20Dark%20Theme.meta.js
// ==/UserScript==

(() => {
	'use strict';

	// Định nghĩa biến màu và cấu hình
	const colors = {
		header: 'rgb(32, 33, 36)',
		dark: {
			1: 'rgb(32, 33, 36)',
			2: 'rgb(40, 41, 45)',
			3: 'rgb(48, 49, 54)',
			4: 'rgb(55, 56, 62)',
			5: 'rgb(62, 63, 69)',
		},
		blue: {
			1: 'rgb(138, 180, 248)',
			2: 'rgb(138, 180, 248)',
			3: 'rgb(120, 160, 255)',
			pool: 'rgb(138, 180, 248)',
		},
		accent: {
			lavender: 'rgb(204, 120, 250)',
			green: 'rgb(106, 135, 89)',
			pink: 'rgb(198, 120, 221)',
			lightBrown: 'rgb(190, 144, 99)',
			red: 'rgb(204, 120, 50)',
			yellow: 'rgb(255, 198, 109)',
			lightYellow: 'rgb(255, 198, 109)',
			blueIce: 'rgb(169, 183, 198)',
			orange: 'rgb(204, 120, 50)',
			purple: 'rgb(155, 89, 182)',
			teal: 'rgb(100, 180, 160)',
			coral: 'rgb(255, 127, 80)',
		},
		text: {
			light: 'rgb(169, 183, 198)',
			success: 'rgba(106, 135, 89, 0.6)',
			error: 'rgba(204, 120, 50, 0.6)',
			warning: 'rgba(255, 198, 109, 0.6)',
			info: 'rgba(138, 180, 248, 0.6)',
		},
		utils: {
			translucent: 'rgba(255, 255, 255, .2)',
			black: 'rgba(0, 0, 0, 1)',
			overlay: 'rgba(0, 0, 0, 0.5)',
			shadow: 'rgba(0, 0, 0, 0.15)',
		},
		gradient: {
			primary: 'linear-gradient(45deg, var(--blue-1), var(--lavender))',
			secondary: 'linear-gradient(45deg, var(--green), var(--blue-ice))',
		},
	};

	// Cấu hình giao diện
	const config = {
		borderRadius: '8px',
		wrapCode: true,
		modHeaders: true,
		invertBkgHPP: false,
		modScrollbars: true,
		animations: true,
		glassmorphism: true,
		customFonts: true,
		darkMode: {
			auto: true,
			level: 'dark',
		},
		performance: {
			reducedMotion: false,
			optimizeRendering: true,
		},
	};

	// Tạo biến CSS root với các biến mới
	const createRootVars = () => {
		const vars = {
			'--dark-1': colors.dark[1],
			'--dark-2': colors.dark[2],
			'--dark-3': colors.dark[3],
			'--dark-4': colors.dark[4],
			'--dark-5': colors.dark[5],
			'--blue-1': colors.blue[1],
			'--blue-2': colors.blue[2],
			'--blue-3': colors.blue[3],
			'--blue-pool': colors.blue.pool,
			'--lavender': colors.accent.lavender,
			'--green': colors.accent.green,
			'--pink': colors.accent.pink,
			'--light-brown': colors.accent.lightBrown,
			'--red': colors.accent.red,
			'--yellow': colors.accent.yellow,
			'--light-yellow': colors.accent.lightYellow,
			'--blue-ice': colors.accent.blueIce,
			'--orange': colors.accent.orange,
			'--purple': colors.accent.purple,
			'--teal': colors.accent.teal,
			'--coral': colors.accent.coral,
			'--light-gray': colors.text.light,
			'--light-green': colors.text.success,
			'--light-red': colors.text.error,
			'--light-warning': colors.text.warning,
			'--light-info': colors.text.info,
			'--translucent': colors.utils.translucent,
			'--black': colors.utils.black,
			'--overlay': colors.utils.overlay,
			'--shadow': colors.utils.shadow,
			'--gradient-primary': colors.gradient.primary,
			'--gradient-secondary': colors.gradient.secondary,
			'--default-border-radius': config.borderRadius,
			'--transition-speed': config.performance.reducedMotion ? '0s' : '0.3s',
			'--font-primary': '"Segoe UI", system-ui, -apple-system, sans-serif',
			'--font-code': '"Fira Code", monospace',
		};

		return Object.entries(vars)
			.map(([key, value]) => `${key}: ${value} !important;`)
			.join('\n');
	};

	// Tạo CSS styles với các cải tiến mới
	const css = `
    :root {
      ${createRootVars()}
    }

    /* Base styles */
    body {
      background-color: var(--dark-3) !important;
      color: var(--light-gray) !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      font-family: var(--font-primary) !important;
      transition: background-color var(--transition-speed) ease !important;
      will-change: transform !important;
      backface-visibility: hidden !important;
      -webkit-font-smoothing: antialiased !important;
    }

    /* Header styles với glassmorphism */
    #main-header {
      ${config.modHeaders ? 'background-image: none !important;' : ''}
      background-color: ${config.glassmorphism ? 'rgba(32, 33, 36, 0.8)' : colors.header} !important;
      backdrop-filter: ${config.glassmorphism ? 'blur(10px)' : 'none'} !important;
      padding: 10px 0 !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
      box-shadow: 0 1px 3px var(--shadow) !important;
    }

    #main-header .width-constraint {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-wrap: wrap !important;
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 0 20px !important;
    }

    #main-header,
    #main-header a,
    #main-header a:visited,
    #main-header a:active {
      color: var(--light-gray) !important;
      text-decoration: none !important;
    }

    /* Navigation styles với animation */
    nav {
      background-color: var(--dark-3) !important;
      border: 1px solid var(--dark-2) !important;
      box-shadow: 0 1px 2px var(--shadow) !important;
      border-radius: var(--default-border-radius) !important;
      margin: 8px 0 !important;
      transition: all var(--transition-speed) ease !important;
      will-change: transform !important;
    }

    nav ul {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 15px !important;
      padding: 10px !important;
      margin: 0 !important;
      list-style: none !important;
    }

    nav li {
      margin: 0 !important;
    }

    nav a {
      padding: 8px 15px !important;
      border-radius: var(--default-border-radius) !important;
      transition: all var(--transition-speed) ease !important;
      position: relative !important;
      overflow: hidden !important;
      will-change: transform !important;
    }

    nav a:hover {
      background-color: var(--dark-4) !important;
      transform: translateY(-2px) !important;
    }

    nav a::after {
      content: '' !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 2px !important;
      background: var(--gradient-primary) !important;
      transform: scaleX(0) !important;
      transition: transform var(--transition-speed) ease !important;
      will-change: transform !important;
    }

    nav a:hover::after {
      transform: scaleX(1) !important;
    }

    /* Link styles với hiệu ứng */
    a:not(.install-link, .install-help-link) {
      color: var(--blue-1) !important;
      text-decoration: none !important;
      transition: all var(--transition-speed) ease !important;
      position: relative !important;
      will-change: transform !important;
    }

    a:not(.install-link, .install-help-link):hover {
      color: var(--blue-ice) !important;
      text-decoration: none !important;
    }

    a:not(.install-link, .install-help-link)::after {
      content: '' !important;
      position: absolute !important;
      width: 100% !important;
      height: 1px !important;
      bottom: -2px !important;
      left: 0 !important;
      background-color: var(--blue-ice) !important;
      transform: scaleX(0) !important;
      transform-origin: right !important;
      transition: transform var(--transition-speed) ease !important;
      will-change: transform !important;
    }

    a:not(.install-link, .install-help-link):hover::after {
      transform: scaleX(1) !important;
      transform-origin: left !important;
    }

    /* Content containers với glassmorphism */
    .script-list,
    .user-list,
    .text-content,
    .discussion-list,
    .list-option-group ul,
    #script-info,
    .discussion-read,
    #discussion-locale,
    #about-user,
    .form-section,
    .script-screenshot-control {
      ${config.modHeaders ? 'background-image: unset !important;' : ''}
      background-color: ${config.glassmorphism ? 'rgba(32, 33, 36, 0.8)' : 'var(--dark-1)'} !important;
      backdrop-filter: ${config.glassmorphism ? 'blur(10px)' : 'none'} !important;
      box-shadow: 0 1px 3px var(--shadow) !important;
      border: 1px solid var(--dark-2) !important;
      border-radius: var(--default-border-radius) !important;
      padding: 15px !important;
      margin-bottom: 15px !important;
      transition: all var(--transition-speed) ease !important;
      will-change: transform !important;
    }

    /* Hover effects với animation */
    .discussion-list li,
    .script-list li,
    .user-list li {
      padding: 15px !important;
      border-radius: var(--default-border-radius) !important;
      transition: all var(--transition-speed) ease !important;
      position: relative !important;
      z-index: 1 !important;
      will-change: transform !important;
      transform: translateZ(0) !important;
    }

    .discussion-list li:hover,
    .script-list li:hover,
    .user-list li:hover {
      background-color: var(--dark-2) !important;
      transform: translateY(-2px) translateZ(0) !important;
      box-shadow: 0 5px 15px var(--shadow) !important;
    }

    /* Form elements với hiệu ứng */
    .default-input,
    input[type="search"],
    input[type="text"],
    input[type="email"],
    input[type="password"],
    select,
    textarea {
      background-color: var(--dark-4) !important;
      border: 2px solid var(--dark-2) !important;
      color: var(--blue-ice) !important;
      border-radius: var(--default-border-radius) !important;
      padding: 8px 12px !important;
      margin: 8px 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      transition: all var(--transition-speed) ease !important;
      font-size: 14px !important;
      font-family: var(--font-primary) !important;
      will-change: transform !important;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none !important;
      border-color: var(--blue-pool) !important;
      box-shadow: 0 0 0 2px rgba(104, 151, 187, 0.2) !important;
      transform: translateY(-1px) !important;
    }

    /* Buttons với gradient và animation */
    .install-link,
    .install-help-link,
    input[type="submit"],
    .button {
      background: var(--gradient-primary) !important;
      color: var(--dark-1) !important;
      border: none !important;
      border-radius: var(--default-border-radius) !important;
      padding: 8px 16px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all var(--transition-speed) ease !important;
      text-align: center !important;
      display: inline-block !important;
      text-decoration: none !important;
      margin: 5px !important;
      box-shadow: 0 1px 2px var(--shadow) !important;
      position: relative !important;
      overflow: hidden !important;
      will-change: transform !important;
    }

    .install-link:hover,
    .install-help-link:hover,
    input[type="submit"]:hover,
    .button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 5px 15px var(--shadow) !important;
    }

    .install-link::before,
    .install-help-link::before,
    input[type="submit"]::before,
    .button::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: -100% !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(
        120deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      ) !important;
      transition: all 0.6s ease !important;
      will-change: transform !important;
    }

    .install-link:hover::before,
    .install-help-link:hover::before,
    input[type="submit"]:hover::before,
    .button:hover::before {
      left: 100% !important;
    }

    /* Responsive design */
    @media (max-width: 1024px) {
      body {
        font-size: 15px !important;
      }

      .width-constraint {
        padding: 0 15px !important;
      }
      
      #main-header .width-constraint {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      
      nav {
        display: block !important;
        width: 100% !important;
      }
      
      .menu-toggle {
        display: block !important;
        padding: 10px !important;
        background: none !important;
        border: none !important;
        color: var(--light-gray) !important;
        cursor: pointer !important;
      }
      
      nav ul {
        display: none !important;
      }
      
      nav.active ul {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
      }
      
      nav li {
        width: 100% !important;
      }
      
      nav a {
        display: block !important;
        text-align: left !important;
        padding: 12px 15px !important;
      }

      /* Mobile Menu Toggle Button */
      .menu-toggle {
        position: absolute !important;
        right: 15px !important;
        top: 15px !important;
        z-index: 1001 !important;
        width: 30px !important;
        height: 30px !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        padding: 0 !important;
      }

      .menu-toggle span {
        display: block !important;
        width: 100% !important;
        height: 2px !important;
        background: var(--light-gray) !important;
        margin: 6px 0 !important;
        transition: all 0.3s ease !important;
      }

      .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px) !important;
      }

      .menu-toggle.active span:nth-child(2) {
        opacity: 0 !important;
      }

      .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px) !important;
      }

      /* Mobile Navigation */
      nav {
        position: fixed !important;
        top: 60px !important;
        left: 0 !important;
        width: 100% !important;
        height: auto !important;
        background: var(--dark-2) !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
        z-index: 1000 !important;
      }

      nav.active {
        transform: translateX(0) !important;
      }

      nav ul {
        padding: 20px !important;
      }

      nav li {
        margin: 10px 0 !important;
      }

      nav a {
        font-size: 16px !important;
        padding: 12px 20px !important;
        display: block !important;
        color: var(--light-gray) !important;
        border-radius: var(--default-border-radius) !important;
      }
    }

    @media (max-width: 600px) {
      body {
        font-size: 14px !important;
      }

      #main-header .width-constraint {
        padding: 0 10px !important;
      }

      .script-list,
      .user-list,
      .text-content {
        padding: 10px !important;
        margin-bottom: 10px !important;
      }

      .install-link,
      .install-help-link,
      input[type="submit"],
      .button {
        width: 100% !important;
        margin: 5px 0 !important;
        padding: 12px 16px !important;
      }
      
      .discussion-list li,
      .script-list li,
      .user-list li {
        padding: 10px !important;
      }
      
      .form-section {
        padding: 10px !important;
      }
      
      input[type="search"],
      input[type="text"],
      input[type="email"],
      input[type="password"],
      select,
      textarea {
        padding: 10px !important;
      }
    }

    @media (max-width: 480px) {
      body {
        font-size: 13px !important;
      }

      .script-list,
      .user-list,
      .text-content {
        padding: 8px !important;
      }

      input,
      select,
      textarea {
        font-size: 16px !important;
      }
      
      #main-header {
        padding: 5px 0 !important;
      }
      
      .width-constraint {
        padding: 0 8px !important;
      }
      
      .discussion-list li,
      .script-list li,
      .user-list li {
        margin-bottom: 8px !important;
      }
      
      .install-link,
      .install-help-link,
      input[type="submit"],
      .button {
        font-size: 14px !important;
        padding: 10px 14px !important;
      }
    }

    /* Scrollbar styles với animation */
    ${
		config.modScrollbars
			? `
        * {
          scrollbar-width: thin !important;
          scrollbar-color: var(--translucent) var(--dark-2) !important;
        }

        ::-webkit-scrollbar {
          width: 8px !important;
          height: 8px !important;
        }

        ::-webkit-scrollbar-track {
          background: var(--dark-2) !important;
          border-radius: var(--default-border-radius) !important;
        }

        ::-webkit-scrollbar-thumb {
          background: var(--translucent) !important;
          border-radius: var(--default-border-radius) !important;
          border: 2px solid var(--dark-2) !important;
          transition: all var(--transition-speed) ease !important;
          will-change: transform !important;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--gradient-primary) !important;
        }
        `
			: ''
	}

    /* Code blocks với font và hiệu ứng mới */
    pre, code {
      font-family: var(--font-code) !important;
      background-color: var(--dark-4) !important;
      border-radius: var(--default-border-radius) !important;
      padding: 0.2em 0.4em !important;
      transition: all var(--transition-speed) ease !important;
      will-change: transform !important;
      max-width: 100% !important;
      overflow-x: auto !important;
    }

    pre:hover, code:hover {
      background-color: var(--dark-5) !important;
    }

    /* Tooltip styles mới */
    [data-tooltip] {
      position: relative !important;
    }

    [data-tooltip]:before {
      content: attr(data-tooltip) !important;
      position: absolute !important;
      bottom: 100% !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      padding: 5px 10px !important;
      background: var(--dark-4) !important;
      color: var(--light-gray) !important;
      border-radius: var(--default-border-radius) !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: all var(--transition-speed) ease !important;
      will-change: transform, opacity !important;
    }

    [data-tooltip]:hover:before {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateX(-50%) translateY(-5px) !important;
    }

    /* Login Form Styles */
    .centered-sections {
      display: flex !important;
      flex-direction: column !important;
      gap: 20px !important;
      max-width: 600px !important;
      margin: 0 auto !important;
      padding: 0 10px !important;
    }

    .external-login-form {
      display: flex !important;
      flex-direction: column !important;
      gap: 15px !important;
    }

    .external-login-container {
      display: block !important;
      margin: 5px 0 !important;
    }

    .external-login {
      width: 100% !important;
      padding: 12px !important;
      border-radius: var(--default-border-radius) !important;
      border: none !important;
      color: var(--light-gray) !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all var(--transition-speed) ease !important;
      will-change: transform !important;
      font-size: 14px !important;
    }

    .google_oauth2-login {
      background-color: #4285f4 !important;
    }

    .gitlab-login {
      background-color: #fc6d26 !important;
    }

    .github-login {
      background-color: #333 !important;
    }

    .external-login:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 5px 15px var(--shadow) !important;
    }

    .remember-me {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      margin: 10px 0 !important;
    }

    .remember-me input[type="checkbox"] {
      width: auto !important;
      margin: 0 !important;
      height: 20px !important;
      width: 20px !important;
    }

    .field {
      margin-bottom: 15px !important;
    }

    .field label {
      display: block !important;
      margin-bottom: 5px !important;
      color: var(--light-gray) !important;
      font-size: 14px !important;
    }

    .actions {
      margin-top: 20px !important;
    }

    .width-constraint {
      max-width: 1200px !important;
      margin: 0 auto !important;
      padding: 20px !important;
    }

    .text-content {
      background-color: var(--dark-2) !important;
      padding: 15px !important;
      border-radius: var(--default-border-radius) !important;
      margin-bottom: 15px !important;
    }

    .text-content p {
      margin-bottom: 15px !important;
      line-height: 1.6 !important;
      font-size: 14px !important;
    }
  `;

	// Áp dụng CSS
	GM_addStyle(css);

  // Add mobile menu toggle functionality
  const addMobileMenuToggle = () => {
    const header = document.querySelector('#main-header');
    if (!header) return;

    // Create menu toggle button if it doesn't exist
    if (!document.querySelector('.menu-toggle')) {
      const menuToggle = document.createElement('button');
      menuToggle.className = 'menu-toggle';
      menuToggle.innerHTML = '<span></span><span></span><span></span>';
      header.appendChild(menuToggle);

      // Add click event listener
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        const nav = document.querySelector('nav');
        if (nav) {
          nav.classList.toggle('active');
        }
      });
    }
  };

  // Run when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addMobileMenuToggle);
  } else {
    addMobileMenuToggle();
  }
})();
