// ==UserScript==
// @name         YouTube God Menu v6.0
// @namespace    Marley
// @version      6.0
// @description  Fully loaded YouTube mod menu with playback, ads, playlist, quality, subtitles, UI tweaks, screenshot, presets, drag & hide, sleek black/red design
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538782/YouTube%20God%20Menu%20v60.user.js
// @updateURL https://update.greasyfork.org/scripts/538782/YouTube%20God%20Menu%20v60.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MENU_ID = 'yt-god-menu';

  // Utility: wait for video element
  function waitForVideo() {
    if (document.querySelector('video')) {
      createMenu();
    } else {
      setTimeout(waitForVideo, 1000);
    }
  }

  // Get main video element
  const getVideo = () => document.querySelector('video');

  // Get YouTube player API for some controls
  const getPlayer = () => {
    const player = document.getElementById('movie_player');
    return player && typeof player.getPlayerState === 'function' ? player : null;
  };

  // Download text as file helper
  function downloadText(filename, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Screenshot current video frame as PNG
  function screenshot() {
    const video = getVideo();
    if (!video) return alert('No video found.');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'yt_screenshot.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  // Style button helper
  function styleButton(btn) {
    Object.assign(btn.style, {
      width: '100%',
      margin: '5px 0',
      padding: '6px',
      border: 'none',
      borderRadius: '7px',
      background: '#1a1a1a',
      color: '#ff4d4d',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(255, 0, 0, 0.3)',
      transition: 'background-color 0.25s ease',
      fontSize: '12px',
      userSelect: 'none',
    });
    btn.onmouseenter = () => (btn.style.background = '#330000');
    btn.onmouseleave = () => (btn.style.background = '#1a1a1a');
  }

  // Create the mod menu UI
  function createMenu() {
    if (document.getElementById(MENU_ID)) return; // avoid duplicates

    const menu = document.createElement('div');
    menu.id = MENU_ID;

    const savedTop = localStorage.getItem('ytMenuTop') || '60px';
    const savedLeft = localStorage.getItem('ytMenuLeft') || '10px';

    Object.assign(menu.style, {
      position: 'fixed',
      top: savedTop,
      left: savedLeft,
      zIndex: '99999',
      background: '#000000',
      color: '#ddd',
      border: '1px solid #444',
      padding: '8px 12px',
      fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      borderRadius: '10px',
      width: '180px',
      maxHeight: '340px',
      fontSize: '12px',
      boxShadow: '0 6px 20px rgba(255, 0, 0, 0.5)',
      userSelect: 'none',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#ff0000 #222',
    });

    // Drag bar
    const dragBar = document.createElement('div');
    dragBar.textContent = '📺 YouTube God Menu';
    Object.assign(dragBar.style, {
      cursor: 'grab',
      fontWeight: '700',
      marginBottom: '8px',
      background: '#111',
      padding: '6px 10px',
      borderRadius: '8px',
      boxShadow: '0 3px 8px rgba(255, 0, 0, 0.6)',
      color: '#ff3c3c',
      userSelect: 'none',
      fontSize: '13px',
      textAlign: 'center',
      letterSpacing: '0.04em',
    });

    // Drag logic
    let isDragging = false;
    dragBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      menu.dataset.offsetX = e.clientX - menu.offsetLeft;
      menu.dataset.offsetY = e.clientY - menu.offsetTop;
      dragBar.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        let newX = e.clientX - menu.dataset.offsetX;
        let newY = e.clientY - menu.dataset.offsetY;
        newX = Math.max(0, Math.min(window.innerWidth - menu.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - menu.offsetHeight, newY));
        menu.style.left = `${newX}px`;
        menu.style.top = `${newY}px`;
      }
    });
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        localStorage.setItem('ytMenuTop', menu.style.top);
        localStorage.setItem('ytMenuLeft', menu.style.left);
        dragBar.style.cursor = 'grab';
      }
    });

    menu.appendChild(dragBar);

    // Toggle menu content button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Hide';
    styleButton(toggleBtn);
    toggleBtn.style.marginBottom = '8px';
    menu.appendChild(toggleBtn);

    const wrapper = document.createElement('div');
    menu.appendChild(wrapper);

    toggleBtn.onclick = () => {
      if (wrapper.style.display !== 'none') {
        wrapper.style.display = 'none';
        toggleBtn.textContent = 'Show';
      } else {
        wrapper.style.display = 'block';
        toggleBtn.textContent = 'Hide';
      }
    };

    // Helper to add buttons
    function addBtn(text, action) {
      const btn = document.createElement('button');
      btn.textContent = text;
      styleButton(btn);
      btn.onclick = action;
      wrapper.appendChild(btn);
    }

    // Playback controls
    addBtn('▶️ +10s', () => {
      const v = getVideo();
      if (v) v.currentTime = Math.min(v.duration, v.currentTime + 10);
    });
    addBtn('⏪ -10s', () => {
      const v = getVideo();
      if (v) v.currentTime = Math.max(0, v.currentTime - 10);
    });
    addBtn('⏩ 2x Speed', () => {
      const v = getVideo();
      if (v) v.playbackRate = 2;
    });
    addBtn('🐢 0.5x Speed', () => {
      const v = getVideo();
      if (v) v.playbackRate = 0.5;
    });
    addBtn('⏸ 1x Speed', () => {
      const v = getVideo();
      if (v) v.playbackRate = 1;
    });
    addBtn('🔁 Loop', () => {
      const v = getVideo();
      if (!v) return;
      v.loop = !v.loop;
      alert('Loop: ' + (v.loop ? 'ON' : 'OFF'));
    });

    // Frame-by-frame stepping
    addBtn('▶ Frame +1', () => {
      const v = getVideo();
      if (!v) return;
      v.pause();
      v.currentTime = Math.min(v.duration, v.currentTime + (1 / 30));
    });
    addBtn('◀ Frame -1', () => {
      const v = getVideo();
      if (!v) return;
      v.pause();
      v.currentTime = Math.max(0, v.currentTime - (1 / 30));
    });

    // Custom playback speed prompt
    addBtn('⚙ Set Speed...', () => {
      const v = getVideo();
      if (!v) return;
      const val = prompt('Enter playback speed (e.g. 1.5)', v.playbackRate);
      if (val !== null) {
        const num = parseFloat(val);
        if (!isNaN(num) && num > 0) v.playbackRate = num;
        else alert('Invalid speed');
      }
    });

    // Volume controls
    addBtn('🔊 Volume +10%', () => {
      const v = getVideo();
      if (v) v.volume = Math.min(1, v.volume + 0.1);
    });
    addBtn('🔉 Volume -10%', () => {
      const v = getVideo();
      if (v) v.volume = Math.max(0, v.volume - 0.1);
    });
    addBtn('🔇 Mute/Unmute', () => {
      const v = getVideo();
      if (v) v.muted = !v.muted;
    });

    // Ad controls
    addBtn('⏭ Skip Ad', () => {
      const skipBtn = document.querySelector('.ytp-ad-skip-button.ytp-button');
      if (skipBtn) skipBtn.click();
      else alert('No skippable ad now');
    });

    addBtn('🔕 Mute Ads Only', () => {
      const v = getVideo();
      if (!v) return alert('No video');
      const adPlaying = document.querySelector('.ad-showing');
      if (adPlaying) {
        v.muted = true;
        alert('Muted for ad');
        // Automatically unmute after ad ends
        const observer = new MutationObserver(() => {
          if (!document.querySelector('.ad-showing')) {
            v.muted = false;
            alert('Ad ended, unmuted');
            observer.disconnect();
          }
        });
        observer.observe(document.body, { attributes: true, subtree: true });
      } else {
        alert('No ad playing now');
      }
    });

    // Playlist controls
    addBtn('⏭ Next Video', () => {
      const nextBtn = document.querySelector('.ytp-next-button');
      if (nextBtn) nextBtn.click();
      else alert('No next video');
    });
    addBtn('⏮ Previous Video', () => {
      const prevBtn = document.querySelector('.ytp-prev-button');
      if (prevBtn) prevBtn.click();
      else alert('No previous video');
    });

    addBtn('🔀 Shuffle Playlist', () => {
      const shuffleBtn = document.querySelector('ytd-toggle-button-renderer.style-scope.ytd-playlist-panel-renderer');
      if (shuffleBtn) shuffleBtn.click();
      else alert('Shuffle not available');
    });

    // Video Quality (uses YouTube player API)
    addBtn('🔧 Quality 1080p', () => {
      const player = getPlayer();
      if (player) player.setPlaybackQuality('hd1080');
      else alert('Player API not ready');
    });
    addBtn('🔧 Quality 720p', () => {
      const player = getPlayer();
      if (player) player.setPlaybackQuality('hd720');
      else alert('Player API not ready');
    });
    addBtn('🔧 Quality Auto', () => {
      const player = getPlayer();
      if (player) player.setPlaybackQuality('auto');
      else alert('Player API not ready');
    });

    // HDR toggle placeholder (YouTube does not expose this easily)
    addBtn('⚡ Toggle HDR (if supported)', () => {
      alert('HDR toggle is not supported by YouTube API');
    });

    // Subtitles
    addBtn('💬 Toggle Captions', () => {
      const btn = document.querySelector('.ytp-subtitles-button');
      if (btn) btn.click();
      else alert('Captions button not found');
    });

    addBtn('📥 Download Subtitles', () => {
      const videoUrl = window.location.href;
      // Use third party service for subs download
      const url = `https://downsub.com/?url=${encodeURIComponent(videoUrl)}`;
      window.open(url, '_blank');
    });

    addBtn('🌐 Auto-Translate Subs', () => {
      const btn = document.querySelector('.ytp-subtitles-button');
      if (!btn) return alert('Captions button not found');
      btn.click(); // open captions menu
      setTimeout(() => {
        const menu = document.querySelector('.ytp-panel-menu');
        if (!menu) return alert('Captions menu not found');
        const autoTransOption = [...menu.querySelectorAll('div')]
          .find(div => /auto-translate/i.test(div.textContent));
        if (autoTransOption) {
          autoTransOption.click();
          setTimeout(() => {
            const langMenu = document.querySelector('.ytp-panel-menu');
            if (langMenu) {
              // default to English for demo
              const eng = [...langMenu.querySelectorAll('div')]
                .find(div => /^English$/i.test(div.textContent));
              if (eng) eng.click();
              alert('Auto-translate to English enabled');
            }
          }, 300);
        } else {
          alert('Auto-translate option not found');
        }
      }, 300);
    });

    // UI tweaks
    let sidebarHidden = false;
    addBtn('🧹 Toggle Sidebar', () => {
      ['#secondary', '#comments', '#related'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.style.display = sidebarHidden ? '' : 'none';
      });
      sidebarHidden = !sidebarHidden;
    });

    let commentsHidden = false;
    addBtn('❌ Toggle Comments', () => {
      const c = document.querySelector('#comments');
      if (c) {
        c.style.display = commentsHidden ? '' : 'none';
        commentsHidden = !commentsHidden;
      } else alert('Comments not found');
    });

    let channelInfoHidden = false;
    addBtn('👤 Toggle Channel Info', () => {
      const el = document.querySelector('#owner');
      if (el) {
        el.style.display = channelInfoHidden ? '' : 'none';
        channelInfoHidden = !channelInfoHidden;
      } else alert('Channel info not found');
    });

    // Screenshot tool
    addBtn('📸 Screenshot Frame', screenshot);

    // Save/Load presets (localStorage based)
    addBtn('💾 Save Preset', () => {
      try {
        const v = getVideo();
        if (!v) return alert('No video');
        const preset = {
          currentTime: v.currentTime,
          playbackRate: v.playbackRate,
          volume: v.volume,
          muted: v.muted,
          loop: v.loop,
        };
        localStorage.setItem('yt_god_preset', JSON.stringify(preset));
        alert('Preset saved');
      } catch (e) {
        alert('Failed to save preset');
      }
    });

    addBtn('📂 Load Preset', () => {
      try {
        const v = getVideo();
        if (!v) return alert('No video');
        const presetStr = localStorage.getItem('yt_god_preset');
        if (!presetStr) return alert('No preset saved');
        const preset = JSON.parse(presetStr);
        v.currentTime = preset.currentTime;
        v.playbackRate = preset.playbackRate;
        v.volume = preset.volume;
        v.muted = preset.muted;
        v.loop = preset.loop;
        alert('Preset loaded');
      } catch (e) {
        alert('Failed to load preset');
      }
    });

    // Auto-generate playlist (very basic)
    addBtn('📃 Generate Playlist', () => {
      alert('This feature is complex and requires YouTube API access — coming soon!');
    });

    // Misc utilities
    addBtn('🎞️ Theater Mode', () => {
      const btn = document.querySelector('.ytp-size-button');
      if (btn) btn.click();
    });

    addBtn('📺 Mini Player', () => {
      const btn = document.querySelector('.ytp-miniplayer-button');
      if (btn) btn.click();
    });

    addBtn('🔄 Reload Page', () => location.reload());

    // Download Video (opens third-party downloader)
    addBtn('📥 Download Video', () => {
      const videoUrl = window.location.href;
      const downloadService = 'https://yt1s.com/en15/youtube-to-mp4';
      const url = `${downloadService}?q=${encodeURIComponent(videoUrl)}`;
      window.open(url, '_blank');
    });

    document.body.appendChild(menu);
  }

  waitForVideo();
})();
