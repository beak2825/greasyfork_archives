// ==UserScript==
// @name        Kick & YouTube Audio Maximizer
// @name:tr     Kick & YouTube Ses Dengeleyici
// @description:tr  Sessiz sesleri yükseltir, yüksek sesleri bastırır.
// @description  Boosts quiet sounds, compresses loud peaks.
// @namespace   http://tampermonkey.net/
// @version     1.7
// @author      baris
// @match       *://*.kick.com/*
// @match       *://kick.com/*
// @match       *://*.youtube.com/*
// @match       *://youtube.com/*
// @match       *://youtu.be/*
// @grant       none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536893/Kick%20%20YouTube%20Audio%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/536893/Kick%20%20YouTube%20Audio%20Maximizer.meta.js
// ==/UserScript==

(() => {
  let ui = null;
  let audioCtx = null;
  let currentGain = null;
  let isDrawing = false;

  // Gain presets
  const gainPresets = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0];
  let currentGainIndex = 3; // Default 2.5

  async function initVideo() {
    const video = document.querySelector('video');
    if (!video || video.dataset.maxApplied) return;
    
    // YouTube için ekstra kontrol
    if (window.location.hostname.includes('youtube.com')) {
      // YouTube video container'ının tam yüklendiğinden emin ol
      const ytdPlayer = document.querySelector('ytd-player, #movie_player, .html5-video-player');
      if (!ytdPlayer) {
        setTimeout(initVideo, 1000);
        return;
      }
    }
    
    video.dataset.maxApplied = '1';

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      const resume = () => { 
        audioCtx.resume(); 
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('click', resume);
      window.addEventListener('keydown', resume);
    }

    try {
      const src = audioCtx.createMediaElementSource(video);
      const comp = audioCtx.createDynamicsCompressor();
      comp.threshold.value = -50;
      comp.knee.value      = 30;
      comp.ratio.value     = 20;
      comp.attack.value    = 0.002;
      comp.release.value   = 0.10;

      const gain = audioCtx.createGain();
      gain.gain.value = gainPresets[currentGainIndex];
      currentGain = gain;

      const ana = audioCtx.createAnalyser();
      ana.fftSize = 512;
      const buf = new Uint8Array(ana.fftSize);

      src.connect(comp);
      comp.connect(gain);
      gain.connect(ana);
      ana.connect(audioCtx.destination);

      const g = await createUI();
      const W = g.canvas.width, H = g.canvas.height;
      let smooth = 0, peak = 0, peakT = 0;
      const lerp = (a, b, f) => a + (b - a) * f;

      isDrawing = true;
      
      (function draw() {
        if (!video.isConnected || !isDrawing) {
          isDrawing = false;
          return;
        }

        requestAnimationFrame(draw);
        ana.getByteTimeDomainData(buf);
        const rms = Math.sqrt(buf.reduce((s, v) => s + ((v - 128) / 128) ** 2, 0) / buf.length);
        const level = Math.min(rms * gain.gain.value, 1);
        smooth = lerp(smooth, level, 0.18);

        const now = performance.now();
        if (smooth > peak || now - peakT > 2000) { peak = smooth; peakT = now; }
        if (now - peakT > 2000) peak = lerp(peak, smooth, 0.05);

        const hue = lerp(220, 0, smooth);
        g.clearRect(0, 0, W, H);
        g.fillStyle = `hsl(${hue} 80% 50%)`;
        g.fillRect(0, 0, smooth * W, H);
        g.fillStyle = '#fff';
        g.fillRect(peak * W - 1, 0, 2, H);
        
        // Gain değerini göster
        g.fillStyle = '#fff';
        g.font = '10px monospace';
        g.fillText(`${gain.gain.value.toFixed(1)}x`, W - 25, 12);
      })();
    } catch (error) {
      console.log('Audio Maximizer: Audio context already in use, retrying...');
      video.dataset.maxApplied = '';
      setTimeout(() => initVideo(), 2000);
    }
  }

  function createUI() {
    return new Promise(res => {
      if (ui) {
        return res(ui.g);
      }

      const waitDOM = () => document.body
        ? Promise.resolve()
        : new Promise(inner => {
            const id = setInterval(() => {
              if (document.body) {
                clearInterval(id);
                inner();
              }
            }, 200);
          });

      waitDOM().then(() => {
        const wrap = Object.assign(document.createElement('div'), {
          style: `
            position: fixed;
            bottom: 80px;
            left: 20px;
            z-index: 2147483647;
            background: rgba(0,0,0,0.8);
            padding: 6px 8px;
            border-radius: 8px;
            pointer-events: auto;
            opacity: 0.1;
            transition: opacity 0.3s ease;
            cursor: pointer;
            user-select: none;
          `.replace(/\s+/g, ' ')
        });
        
        wrap.innerHTML = `
          <div style="color:#fff;font-family:monospace;margin-bottom:4px;font-size:11px;">
            🔊 Maximizer by Barış
          </div>`;
        
        const canvas = Object.assign(document.createElement('canvas'), {
          width: 300, 
          height: 20,
          style: 'background:#222;border-radius:6px;display:block;'
        });
        
        wrap.appendChild(canvas);

        // Hover efekti
        wrap.addEventListener('mouseenter', () => {
          wrap.style.opacity = '1';
        });
        
        wrap.addEventListener('mouseleave', () => {
          wrap.style.opacity = '0.1';
        });

        // Click ile gain değiştirme
        wrap.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          currentGainIndex = (currentGainIndex + 1) % gainPresets.length;
          if (currentGain) {
            currentGain.gain.value = gainPresets[currentGainIndex];
          }
          
          // Click efekti
          wrap.style.transform = 'scale(0.95)';
          setTimeout(() => {
            wrap.style.transform = 'scale(1)';
          }, 100);
        });

        // Touch support for mobile
        wrap.addEventListener('touchstart', (e) => {
          e.preventDefault();
          wrap.style.opacity = '1';
        });

        wrap.addEventListener('touchend', (e) => {
          e.preventDefault();
          currentGainIndex = (currentGainIndex + 1) % gainPresets.length;
          if (currentGain) {
            currentGain.gain.value = gainPresets[currentGainIndex];
          }
          setTimeout(() => {
            wrap.style.opacity = '0.1';
          }, 1000);
        });

        document.body.appendChild(wrap);

        ui = {
          wrap: wrap,
          canvas: canvas,
          g: canvas.getContext('2d')
        };
        
        res(ui.g);
      });
    });
  }

  // Video cleanup function
  function cleanupVideo() {
    const videos = document.querySelectorAll('video[data-max-applied]');
    videos.forEach(video => {
      if (!video.isConnected) {
        video.dataset.maxApplied = '';
      }
    });
  }

  // Başlangıç ve dinleyiciler
  (async () => {
    // İlk yükleme
    setTimeout(initVideo, 1000);

    let lastUrl = location.href;
    const observerCallback = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        isDrawing = false;
        cleanupVideo();
        setTimeout(initVideo, 1500); // YouTube için daha uzun bekleme
      }
    };

    // URL değişimlerini takip et
    setInterval(observerCallback, 1000);

    // DOM değişimlerini takip et
    let timeoutId;
    new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(initVideo, 500);
    }).observe(document.body, {
      childList: true,
      subtree: true
    });

    // YouTube specific improvements
    if (window.location.hostname.includes('youtube.com')) {
      // YouTube navigation events
      window.addEventListener('yt-navigate-finish', () => {
        setTimeout(initVideo, 1000);
      });
      
      // Polymer app navigation
      window.addEventListener('popstate', () => {
        setTimeout(initVideo, 1000);
      });
    }
  })();
})();