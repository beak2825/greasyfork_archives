// ==UserScript==
// @name         Tandro Avatar stealer
// @namespace    https://tandro.de/
// @icon         https://i.ibb.co/BKwQLg9P/logo-small-4.png
// @version      1.12
// @author       ##########
// @license MIT
// @description  Show avatars loaded from Supabase
// @match        https://tandro.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543369/Tandro%20Avatar%20stealer.user.js
// @updateURL https://update.greasyfork.org/scripts/543369/Tandro%20Avatar%20stealer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const avatarHost = 'https://cyehwjytcqcjmsvprrgh.supabase.co/storage/v1/object/public/avatars/';
  const seen = new Set();

  let container = null;
  let avatarList = null;
  let header = null;

  // State for dragging
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let panelStartLeft = 0;
  let panelStartTop = 0;

function createPanel() {
  if (container) return;

  container = document.createElement('div');
  container.id = 'avatar-monitor';
  Object.assign(container.style, {
    position: 'fixed',
    top: '80px',
    right: '80px',
    width: '320px',
    height: '420px',
    background: '#2a1a3d',
    border: '1px solid #4b367c',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(75, 54, 124, 0.7)',
    resize: 'both',
    overflow: 'hidden',
    padding: '0',
    zIndex: '9999',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: '13px',
    userSelect: 'none',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    color: '#ddd',
  });

  // Header (sticky, fixed within panel)
  header = document.createElement('div');
  Object.assign(header.style, {
    flexShrink: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#5e3b9a',
    color: '#eee',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'move',
    userSelect: 'none',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    position: 'relative',
    zIndex: '10',
  });
  header.textContent = '🖼️ click to download';

  // Close button inside header
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.title = 'Schließen';
  Object.assign(closeBtn.style, {
    fontSize: '18px',
    background: 'transparent',
    border: 'none',
    color: '#eee',
    cursor: 'pointer',
    padding: '0 6px',
    userSelect: 'none',
    lineHeight: '1',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  });
  closeBtn.onmouseenter = () => closeBtn.style.backgroundColor = 'rgba(255,255,255,0.15)';
  closeBtn.onmouseleave = () => closeBtn.style.backgroundColor = 'transparent';
  closeBtn.onclick = () => {
    container.remove();
    container = null;
  };

  header.appendChild(closeBtn);
  container.appendChild(header);

  // Avatar list container scrolls separately
  avatarList = document.createElement('div');
  Object.assign(avatarList.style, {
    flexGrow: '1',
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    backgroundColor: '#3a255f',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  });
  container.appendChild(avatarList);

  document.body.appendChild(container);

  // Set up dragging behavior on header
  header.addEventListener('mousedown', dragStart);
}


  // Drag event handlers
  function dragStart(e) {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    // Get current left/top as numbers, fallback if style not set
    const rect = container.getBoundingClientRect();
    panelStartLeft = rect.left;
    panelStartTop = rect.top;

    // Change cursor globally and disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'move';

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
  }

  function dragMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    // Update container position (constrain to viewport)
    let newLeft = panelStartLeft + dx;
    let newTop = panelStartTop + dy;

    // Prevent going too far off screen (you can adjust these limits)
    const maxLeft = window.innerWidth - container.offsetWidth;
    const maxTop = window.innerHeight - container.offsetHeight;
    newLeft = Math.min(Math.max(0, newLeft), maxLeft);
    newTop = Math.min(Math.max(0, newTop), maxTop);

    Object.assign(container.style, {
      left: `${newLeft}px`,
      top: `${newTop}px`,
      right: 'auto', // disable right positioning once dragged
    });
  }

  function dragEnd() {
    isDragging = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', dragMove);
    window.removeEventListener('mouseup', dragEnd);
  }

  // Add avatar images if not yet shown
  function addAvatar(url) {
    if (seen.has(url)) return;
    seen.add(url);

    createPanel();

    const img = document.createElement('img');
    img.src = url;
    Object.assign(img.style, {
      width: '64px',
      height: '64px',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid #ccc',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      cursor: 'default',
    });
    img.title = url.split('/').pop();

    avatarList.appendChild(img);
  }

  // Scan page for avatars
  function scanAndAddAvatars() {
    document.querySelectorAll('img').forEach(img => {
      if (img.src.startsWith(avatarHost)) {
        addAvatar(img.src);
      }
    });
  }

  // Watch DOM for new avatars added dynamically
  function watchForAvatars() {
    scanAndAddAvatars();

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.tagName === 'IMG' && node.src.startsWith(avatarHost)) {
            addAvatar(node.src);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach(img => {
              if (img.src.startsWith(avatarHost)) {
                addAvatar(img.src);
              }
            });
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }


    // Helper to generate random filename
function randomFilename(extension = 'png') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `avatar_${randomStr}.${extension}`;
}

// Add click-to-download with EXIF strip for avatars
function addAvatar(url) {
  if (seen.has(url)) return;
  seen.add(url);

  createPanel();

  const img = document.createElement('img');
  img.src = url;
  Object.assign(img.style, {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',  // clickable now
  });
  img.title = url.split('/').pop();

  // On click, download stripped & randomized filename
  img.addEventListener('click', async () => {
    try {
      const response = await fetch(url, {cache: 'no-store'});
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();

      // Create ImageBitmap for canvas drawing (strip EXIF)
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0);

      // Convert canvas to blob (PNG) — this strips EXIF
      canvas.toBlob((strippedBlob) => {
        if (!strippedBlob) {
          alert('Failed to process image.');
          return;
        }
        const downloadUrl = URL.createObjectURL(strippedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;

        // Try to preserve extension or use png if unknown
        let ext = 'png';
        const parts = url.split('.');
        if (parts.length > 1) {
          const possibleExt = parts.pop().toLowerCase();
          if (['png','jpg','jpeg','gif','webp','bmp'].includes(possibleExt)) {
            ext = possibleExt === 'jpeg' ? 'jpg' : possibleExt;
          }
        }

        a.download = randomFilename(ext);
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadUrl);
      }, 'image/png');
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  });

  avatarList.appendChild(img);
}



  // Insert toggle button in sidebar
function createToggleButton() {
  if (document.getElementById('avatar-toggle-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'avatar-toggle-btn';
  Object.assign(btn.style, {
    position: 'fixed',
    top: '1px',
    left: '1px',
    zIndex: '10000',
    width: '60px',
    height: '60px',
    padding: '0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  });

  // Create img inside button
  const img = document.createElement('img');
  img.src = 'https://i.ibb.co/BKwQLg9P/logo-small-4.png'; //
  img.alt = 'start stealer';
  Object.assign(img.style, {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '6px',
  });

  btn.appendChild(img);

  btn.addEventListener('mouseenter', () => {
    btn.style.filter = 'brightness(0.8)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.filter = 'none';
  });

  btn.addEventListener('click', () => {
    if (container && document.body.contains(container)) {
      container.remove();
      container = null;
    } else {
      createPanel();
      scanAndAddAvatars();
    }
  });

  document.body.appendChild(btn);
}

createToggleButton();



  insertSidebarButton();
  watchForAvatars();

})();
