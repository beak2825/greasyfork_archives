// ==UserScript==
// @name         YouTube Neon Germany Redesign Complete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Komplett neues Neon-Germany Design für YouTube, mit Parallax, Animationen, Mini-Player, Darkmode und mehr. iPad optimiert.
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537249/YouTube%20Neon%20Germany%20Redesign%20Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/537249/YouTube%20Neon%20Germany%20Redesign%20Complete.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Hilfsfunktion: aktuelle Stunde für Darkmode-Check
  const hour = new Date().getHours();
  const isDaytime = hour > 7 && hour < 20;

  // Haupt CSS Styles
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap');
    * {
      box-sizing: border-box;
      margin: 0; padding: 0;
      user-select:none;
    }
    html, body {
      height: 100%; width: 100%;
      font-family: 'Roboto Slab', serif;
      background: ${isDaytime ? '#111' : '#000'};
      color: #eee;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }
    #app {
      position: relative;
      min-height: 100vh;
      background:
        linear-gradient(45deg, #ff0000aa, #ffff0099 60%, #ff0000cc 90%),
        url('https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg') no-repeat center right/contain;
      background-attachment: fixed;
      padding: 80px 20px 60px;
    }
    /* Sticky Header mit Neon-Germany-Logo */
    header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 60px;
      background: #111;
      border-bottom: 1px solid #ff0000cc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 1000;
      box-shadow: 0 0 10px #ff0000dd;
      transition: height 0.3s ease;
    }
    header.shrink {
      height: 40px;
      box-shadow: 0 0 8px #ff000077 inset;
    }
    header .logo {
      font-weight: 700;
      font-size: 1.6rem;
      color: #ff0000;
      text-shadow: 0 0 8px #ff0000, 0 0 15px #ff3300;
      user-select:none;
      display: flex; align-items: center;
      gap: 10px;
    }
    header .logo svg {
      width: 32px;
      height: 18px;
      filter: drop-shadow(0 0 3px #ff0000);
      vertical-align: middle;
    }
    header nav button {
      background: transparent;
      border: none;
      color: #ff3300;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 5px;
      box-shadow: 0 0 6px #ff3300;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      user-select:none;
    }
    header nav button:hover {
      box-shadow: 0 0 20px #ff3300;
      transform: scale(1.1);
    }
    /* Main Content */
    main {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
      gap: 18px;
      margin-top: 20px;
      padding-bottom: 60px;
    }
    /* Video Cards */
    .video-card {
      background: #222;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 8px #ff0000aa;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.4s ease;
      display: flex;
      flex-direction: column;
      user-select:none;
    }
    .video-card:hover {
      box-shadow: 0 0 20px #ff3300;
      transform: translateY(-5px);
    }
    .thumbnail {
      width: 100%;
      aspect-ratio: 16 / 9;
      background-position: center;
      background-size: cover;
      filter: brightness(0.85);
      transition: filter 0.3s ease;
    }
    .video-card:hover .thumbnail {
      filter: brightness(1);
    }
    .info {
      padding: 10px;
      color: #eee;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .title {
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 8px;
      text-shadow: 0 0 5px #ff3300;
      cursor: default;
      animation: pencil-glow 3s infinite alternate ease-in-out;
    }
    @keyframes pencil-glow {
      0% { text-shadow: 0 0 4px #ff3300; }
      50% { text-shadow: 0 0 20px #ff3300; }
      100% { text-shadow: 0 0 4px #ff3300; }
    }
    .like-button {
      align-self: flex-start;
      background: transparent;
      border: 1.8px solid #ff3300;
      color: #ff3300;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      user-select:none;
      box-shadow: 0 0 10px #ff3300;
      transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }
    .like-button:hover {
      box-shadow: 0 0 25px #ff6600;
      background-color: #ff3300;
      color: #fff;
      transform: scale(1.1);
    }
    .like-button.liked {
      background-color: #ff0000;
      color: white;
      box-shadow: 0 0 30px #ff0000;
    }
    /* Mini Player */
    #mini-player {
      position: fixed;
      bottom: 60px; right: 20px;
      width: 320px; height: 180px;
      border-radius: 12px;
      box-shadow: 0 0 30px #ff0000cc;
      border: 2.5px solid #ff3300;
      overflow: hidden;
      z-index: 1500;
      background: #000;
      transition: opacity 0.5s ease;
    }
    #mini-player iframe {
      width: 100%; height: 100%;
      border: none;
    }
    /* Scroll to top */
    #scroll-top {
      position: fixed;
      bottom: 20px; right: 20px;
      background: #ff3300;
      border-radius: 50%;
      width: 48px; height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 0 20px #ff3300;
      transition: opacity 0.4s ease;
      opacity: 0;
      z-index: 1500;
      user-select:none;
    }
    #scroll-top.visible {
      opacity: 1;
    }
    #scroll-top svg {
      fill: white;
      width: 24px; height: 24px;
    }
    /* Responsive Anpassung für iPad */
    @media (max-width: 768px) {
      main {
        grid-template-columns: 1fr 1fr;
        margin-top: 70px;
        padding: 0 10px 60px;
      }
      #mini-player {
        width: 280px;
        height: 160px;
        bottom: 50px;
      }
    }
  `;
  document.head.appendChild(style);

  // HTML Struktur ersetzen
  document.documentElement.innerHTML = `
    <head>
      <title>YouTube Neon Germany Redesign</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    </head>
    <body>
      <header>
        <div class="logo" aria-label="YouTube Neon Germany Logo">
          <svg viewBox="0 0 24 14" aria-hidden="true" focusable="false">
            <rect width="24" height="14" fill="#ff0000"/>
            <rect width="24" height="4.6" fill="#000"/>
            <rect y="4.6" width="24" height="4.8" fill="#ffcc00"/>
            <rect y="9.4" width="24" height="4.6" fill="#000"/>
            <path d="M9 4.5L16 7 9 9.5V4.5Z" fill="#fff"/>
          </svg>
          <span>YouTube</span>
        </div>
        <nav>
          <button id="darkmode-toggle" aria-label="Darkmode umschalten">🌙</button>
        </nav>
      </header>
      <div id="app" role="main" tabindex="0" aria-live="polite" aria-atomic="true">
        <main id="video-list" aria-label="Video Liste"></main>
      </div>
      <div id="mini-player" aria-label="Mini Video Player" hidden></div>
      <div id="scroll-top" aria-label="Nach oben scrollen" role="button" tabindex="0">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 4l-8 8h16z"/>
        </svg>
      </div>
    </body>
  `;

  const app = document.getElementById('app');
  const videoList = document.getElementById('video-list');
  const miniPlayer = document.getElementById('mini-player');
  const scrollTopBtn = document.getElementById('scroll-top');
  const darkModeToggle = document.getElementById('darkmode-toggle');
  const header = document.querySelector('header');

  // Beispiel Videos (Dummy Daten)
  const videos = [
    {
      title: "Neon Germany YouTube Redesign",
      videoId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    },
    {
      title: "Pencil Effect Animation Tutorial",
      videoId: "3JZ_D3ELwOQ",
      thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    },
    {
      title: "Parallax Scroll Design Inspiration",
      videoId: "sGbxmsDFVnE",
      thumbnail: "https://img.youtube.com/vi/sGbxmsDFVnE/hqdefault.jpg",
    },
    {
      title: "Dark Mode Design Tips",
      videoId: "wp5pckvF4NQ",
      thumbnail: "https://img.youtube.com/vi/wp5pckvF4NQ/hqdefault.jpg",
    },
  ];

  // Video Liste rendern
  function renderVideos() {
    videoList.innerHTML = "";
    videos.forEach(({title, videoId, thumbnail}) => {
      const card = document.createElement('div');
      card.className = "video-card";
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Video abspielen: ${title}`);

      const thumbDiv = document.createElement('div');
      thumbDiv.className = "thumbnail";
      thumbDiv.style.backgroundImage = `url(${thumbnail})`;
      card.appendChild(thumbDiv);

      const info = document.createElement('div');
      info.className = "info";

      const t = document.createElement('div');
      t.className = "title";
      t.textContent = title;

      const likeBtn = document.createElement('button');
      likeBtn.className = "like-button";
      likeBtn.textContent = "👍 Like";
      likeBtn.setAttribute('aria-pressed', 'false');

      // Like Button Toggle
      likeBtn.addEventListener('click', e => {
        e.stopPropagation();
        if(likeBtn.classList.contains('liked')){
          likeBtn.classList.remove('liked');
          likeBtn.setAttribute('aria-pressed', 'false');
        } else {
          likeBtn.classList.add('liked');
          likeBtn.setAttribute('aria-pressed', 'true');
        }
      });

      info.appendChild(t);
      info.appendChild(likeBtn);
      card.appendChild(info);

      // Klick öffnet Mini-Player mit Video
      card.addEventListener('click', () => {
        miniPlayer.hidden = false;
        miniPlayer.innerHTML = `<iframe 
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>`;
        miniPlayer.focus();
      });

      videoList.appendChild(card);
    });
  }
  renderVideos();

  // Scroll to top Button Logik
  window.addEventListener('scroll', () => {
    if(window.scrollY > 250){
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
    // Header Shrink
    if(window.scrollY > 50){
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
  });
  scrollTopBtn.addEventListener('keydown', e => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      scrollTopBtn.click();
    }
  });

  // Darkmode Toggle Button
  darkModeToggle.addEventListener('click', () => {
    if(document.documentElement.style.backgroundColor === 'rgb(0, 0, 0)'){
      // hell schalten
      document.documentElement.style.backgroundColor = '#111';
      document.body.style.backgroundColor = '#111';
      darkModeToggle.textContent = '🌙';
    } else {
      document.documentElement.style.backgroundColor = '#000';
      document.body.style.backgroundColor = '#000';
      darkModeToggle.textContent = '☀️';
    }
  });

  // Parallax Background Scroll
  window.addEventListener('scroll', () => {
    const y = window.scrollY / 4;
    app.style.backgroundPosition = `center calc(50% + ${y}px), center right/contain`;
  });
})();