// ==UserScript==
// @name         Voxiom.io Emu's Chams X (2025) **WORKING**
// @namespace    https://youtube.com/@Emulation12
// @version      1.0.0
// @description  Advanced chams and wallhack mod menu with multiple mesh types and glitch fix
// @author       Emulation
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539156/Voxiomio%20Emu%27s%20Chams%20X%20%282025%29%20%2A%2AWORKING%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/539156/Voxiomio%20Emu%27s%20Chams%20X%20%282025%29%20%2A%2AWORKING%2A%2A.meta.js
// ==/UserScript==

(function() {
  (function() {
    // Base settings for chams (all off except Normal mesh)
    const prototype_ = {
      player: {
        opacity: 1,            // full opacity
        wireframe: false,
        seeThroughWalls: false,
        meshType: 'Normal',    // <-- default visible mesh
      }
    };

    const playerMaterials = new Set();

    // Patch Array.push to hook materials for players
    const originalPush = Array.prototype.push;
    Array.prototype.push = function(...args) {
      for (const obj of args) {
        const mat = obj?.material;
        if (!mat) continue;

        if (mat.type === "MeshBasicMaterial") {
          mat.transparent = true;
          playerMaterials.add(mat);
          applyMeshType(mat); // apply mesh effect immediately
        }
      }
      return originalPush.apply(this, args);
    };

    // Apply chams and mesh effect to a material
    function applyChamsSettings() {
      playerMaterials.forEach(mat => {
        if (!mat) return;
        mat.opacity = prototype_.player.opacity;
        mat.wireframe = prototype_.player.wireframe;
        mat.transparent = true;
        mat.side = 2; // DoubleSide

        if (prototype_.player.seeThroughWalls) {
          mat.depthTest = false;
          mat.depthFunc = 7; // Always
        } else {
          mat.depthTest = true;
          mat.depthFunc = 3; // LEQUAL
        }
        applyMeshType(mat);
      });
    }

    // Dynamic color helpers
    function getCrazyColor() {
      const time = Date.now() / 100;
      const r = Math.floor((Math.sin(time) + 1) * 127);
      const g = Math.floor((Math.sin(time + 2) + 1) * 127);
      const b = Math.floor((Math.sin(time + 4) + 1) * 127);
      return `rgb(${r},${g},${b})`;
    }
    function getBrainstormColor() {
      const time = Date.now() / 200;
      const baseHue = (time * 50) % 360;
      return `hsl(${baseHue}, 80%, 70%)`;
    }

    // Mesh type implementations with glitch fix
    function applyMeshType(mat) {
      const type = prototype_.player.meshType;

      // Reset base defaults
      mat.color.set('white');
      if(mat.emissive) mat.emissive.setHex(0x000000);
      mat.wireframe = prototype_.player.wireframe;
      mat.side = 2; // DoubleSide

      switch(type) {
        case 'Normal':
          // Fully opaque, no transparency to avoid glitch
          mat.opacity = 1;
          mat.transparent = false;
          mat.depthTest = true;
          break;

        case 'Glow Neon':
          mat.color.set('#00FFFF');
          mat.opacity = prototype_.player.opacity;
          if(mat.emissive) mat.emissive.setHex(0x00FFFF);
          mat.transparent = mat.opacity < 1;
          mat.depthTest = true;
          break;

        case 'Rainbow':
          // Slightly transparent, disable depth test for glow effect
          mat.transparent = true;
          mat.opacity = 0.9;
          mat.depthTest = false;
          // Color updated dynamically in animate()
          break;

        case 'Glass':
          mat.color.set('#88CCFF');
          mat.opacity = 0.3;
          mat.transparent = true;
          mat.depthTest = true;
          break;

        case 'Black Silhouette':
          mat.color.set('#000000');
          mat.opacity = 1;
          mat.transparent = false;
          mat.depthTest = true;
          break;

        case 'Red Danger':
          mat.color.set('#FF0000');
          mat.opacity = 0.9;
          mat.transparent = true;
          mat.depthTest = true;
          break;

        case 'Hacker Matrix':
          mat.color.set('#00FF00');
          mat.wireframe = true;
          mat.opacity = 1;
          mat.transparent = false;
          mat.depthTest = true;
          break;

        case 'Invisible Ghost':
          mat.opacity = 0.05;
          mat.transparent = true;
          mat.depthTest = true;
          break;

        case 'Crazy Spin':
          mat.transparent = true;
          mat.opacity = 0.9;
          mat.depthTest = false;
          mat.color.set(getCrazyColor());
          break;

        case 'Fireball':
          mat.color.set('#FF6600');
          if(mat.emissive) mat.emissive.setHex(0xFF6600);
          mat.opacity = 0.9;
          mat.transparent = true;
          mat.depthTest = true;
          break;

        case 'Brainstorm':
          mat.transparent = true;
          mat.opacity = 0.9;
          mat.depthTest = false;
          mat.color.set(getBrainstormColor());
          break;

        default:
          // fallback to normal
          mat.opacity = prototype_.player.opacity;
          mat.transparent = mat.opacity < 1;
          mat.depthTest = true;
          break;
      }
    }

    // Animate dynamic mesh effects only when menu visible
    let animationFrameId;
    function animate() {
      if (!menuVisible) return;
      playerMaterials.forEach(mat => {
        if (!mat) return;
        if (prototype_.player.meshType === 'Rainbow') {
          const hue = (Date.now() / 50) % 360;
          const color = `hsl(${hue}, 100%, 50%)`;
          mat.color.set(color);
          if(mat.emissive) mat.emissive.setHex(0x000000);
        } else if (prototype_.player.meshType === 'Crazy Spin') {
          mat.color.set(getCrazyColor());
        } else if (prototype_.player.meshType === 'Brainstorm') {
          mat.color.set(getBrainstormColor());
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    // --- UI ---

    // Add style
    if(!document.getElementById("emuChamsStyle")) {
      const style = document.createElement("style");
      style.id = "emuChamsStyle";
      style.innerHTML = `
        #menu {
          position: fixed;
          top: 80px;
          left: 80px;
          background: rgba(20,20,20,0.9);
          padding: 15px;
          border: 2px solid #00f0ff;
          color: white;
          font-family: sans-serif;
          border-radius: 10px;
          z-index: 999999;
          user-select: none;
          box-shadow: 0 0 15px #00f0ff;
          width: 320px;
          display: flex;
          flex-direction: row;
          gap: 10px;
        }
        #menu .categories {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100px;
        }
        #menu .categories button {
          background: #111;
          border: 1.5px solid #00f0ff;
          color: white;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s ease;
        }
        #menu .categories button.active, #menu .categories button:hover {
          background: #00f0ff;
          color: #111;
        }
        #menu .content {
          flex: 1;
          background: #222;
          border-radius: 8px;
          padding: 10px;
          max-height: 400px;
          overflow-y: auto;
        }
        #menu h1 {
          font-size: 18px;
          margin: 0 0 12px 0;
          text-align: center;
          background: linear-gradient(to right, red, yellow, lime, cyan, magenta);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow 5s linear infinite;
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg);}
          100% { filter: hue-rotate(360deg);}
        }
        label {
          display: block;
          margin: 5px 0;
        }
        input[type="checkbox"] {
          margin-left: 8px;
          transform: scale(1.1);
        }
        input[type="range"] {
          width: 100%;
        }
        .mesh-button {
          background: #0088cc;
          border: none;
          color: white;
          padding: 8px;
          margin: 4px 4px 4px 0;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.25s ease;
        }
        .mesh-button:hover {
          background: #00bbff;
        }
        .mesh-button.active {
          background: #00f0ff;
          color: #111;
        }
      `;
      document.head.appendChild(style);
    }

    // Create menu container if not exist
    let menu = document.getElementById("menu");
    if (!menu) {
      menu = document.createElement("div");
      menu.id = "menu";

      const categoriesDiv = document.createElement("div");
      categoriesDiv.className = "categories";

      const contentDiv = document.createElement("div");
      contentDiv.className = "content";

      const title = document.createElement("h1");
      title.textContent = "EMULATION'S CHAMS+";

      contentDiv.appendChild(title);
      menu.appendChild(categoriesDiv);
      menu.appendChild(contentDiv);
      document.body.appendChild(menu);

      // Categories data with diverse mesh types
      const categories = [
        {
          name: "Advantage",
          description: "Wallhacks & chams settings",
          meshes: [
            { name: "Normal", desc: "Default visible mesh" },
            { name: "Glow Neon", desc: "Glowing neon color" },
            { name: "Glass", desc: "Transparent glass look" },
            { name: "Black Silhouette", desc: "Solid black shape" },
            { name: "Red Danger", desc: "Bright red color" },
            { name: "Hacker Matrix", desc: "Green wireframe glow" },
            { name: "Invisible Ghost", desc: "Almost invisible" },
          ]
        },
        {
          name: "Fun",
          description: "Rainbow & spin effects",
          meshes: [
            { name: "Rainbow", desc: "Cycle through rainbow colors" },
            { name: "Crazy Spin", desc: "Colors cycling fast" },
            { name: "Fireball", desc: "Fiery orange glow" },
            { name: "Brainstorm", desc: "Pulsing pastel colors" },
          ]
        },
        {
          name: "Crazy",
          description: "Random neon madness",
          meshes: [
            { name: "Crazy Spin", desc: "Fast color cycling" },
            { name: "Rainbow", desc: "Bright rainbow cycle" },
            { name: "Glow Neon", desc: "Neon bright glow" },
            { name: "Fireball", desc: "Hot fire effect" },
            { name: "Black Silhouette", desc: "Dark outline" },
          ]
        },
        {
          name: "Meshes",
          description: "Fake mesh visual styles",
          meshes: [
            { name: "Normal", desc: "Default visible mesh" },
            { name: "Glass", desc: "See-through glass" },
            { name: "Black Silhouette", desc: "Solid black shape" },
            { name: "Glow Neon", desc: "Neon glowing" },
            { name: "Red Danger", desc: "Bright red" },
            { name: "Invisible Ghost", desc: "Very transparent" },
          ]
        },
        {
          name: "Settings",
          description: "Chams opacity & wireframe",
          meshes: [] // special for sliders & toggles
        }
      ];

      let currentCategory = "Advantage";

      function updateCategoryButtons() {
        [...categoriesDiv.children].forEach(btn => {
          if (btn.textContent === currentCategory) btn.classList.add("active");
          else btn.classList.remove("active");
        });
      }

      function updateCategoryUI() {
        contentDiv.innerHTML = "";
        contentDiv.appendChild(title);

        if (currentCategory === "Settings") {
          // Settings sliders & toggles
          const seeLabel = document.createElement("label");
          seeLabel.textContent = "See Through Walls:";
          const seeToggle = document.createElement("input");
          seeToggle.type = "checkbox";
          seeToggle.checked = prototype_.player.seeThroughWalls;
          seeToggle.onchange = e => {
            prototype_.player.seeThroughWalls = e.target.checked;
            applyChamsSettings();
          };
          seeLabel.appendChild(seeToggle);
          contentDiv.appendChild(seeLabel);

          const wireLabel = document.createElement("label");
          wireLabel.textContent = "Wireframe:";
          const wireToggle = document.createElement("input");
          wireToggle.type = "checkbox";
          wireToggle.checked = prototype_.player.wireframe;
          wireToggle.onchange = e => {
            prototype_.player.wireframe = e.target.checked;
            applyChamsSettings();
          };
          wireLabel.appendChild(wireToggle);
          contentDiv.appendChild(wireLabel);

          const opacityLabel = document.createElement("label");
          opacityLabel.textContent = `Opacity: ${prototype_.player.opacity.toFixed(1)}`;
          const opacitySlider = document.createElement("input");
          opacitySlider.type = "range";
          opacitySlider.min = 0;
          opacitySlider.max = 1;
          opacitySlider.step = 0.1;
          opacitySlider.value = prototype_.player.opacity;
          opacitySlider.oninput = e => {
            prototype_.player.opacity = parseFloat(e.target.value);
            opacityLabel.textContent = `Opacity: ${prototype_.player.opacity.toFixed(1)}`;
            applyChamsSettings();
          };
          contentDiv.appendChild(opacityLabel);
          contentDiv.appendChild(opacitySlider);

        } else {
          // Show mesh buttons for category
          const cat = categories.find(c => c.name === currentCategory);
          if (!cat) return;

          const info = document.createElement("div");
          info.style.marginBottom = "10px";
          info.style.fontSize = "13px";
          info.style.opacity = "0.8";
          info.textContent = cat.description || "";
          contentDiv.appendChild(info);

          cat.meshes.forEach(mesh => {
            const btn = document.createElement("button");
            btn.className = "mesh-button";
            btn.textContent = mesh.name;
            btn.title = mesh.desc || "";
            if (prototype_.player.meshType === mesh.name) btn.classList.add("active");
            btn.onclick = () => {
              prototype_.player.meshType = mesh.name;
              applyChamsSettings();
              updateCategoryUI();
            };
            contentDiv.appendChild(btn);
          });
        }
      }

      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.name;
        btn.title = cat.description || "";
        if (cat.name === currentCategory) btn.classList.add("active");
        btn.onclick = () => {
          currentCategory = cat.name;
          updateCategoryUI();
          updateCategoryButtons();
        };
        categoriesDiv.appendChild(btn);
      });

      updateCategoryUI();
      updateCategoryButtons();

      // Make menu draggable
      let dragging = false, offsetX = 0, offsetY = 0;
      menu.addEventListener("mousedown", e => {
        if(e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
        dragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
      });
      window.addEventListener("mouseup", () => dragging = false);
      window.addEventListener("mousemove", e => {
        if (dragging) {
          menu.style.left = (e.clientX - offsetX) + "px";
          menu.style.top = (e.clientY - offsetY) + "px";
        }
      });
    }

    // Show menu by default on load
    let menuVisible = true;
    if(menu) menu.style.display = "flex";

    // Toggle menu by semicolon key
    function toggleMenu() {
      menuVisible = !menuVisible;
      if(menu) menu.style.display = menuVisible ? "flex" : "none";
      if (menuVisible) {
        animate();
      } else {
        if(animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    }

    window.addEventListener("keydown", e => {
      const tag = document.activeElement.tagName.toLowerCase();
      if(tag === "input" || tag === "textarea" || e.repeat) return;
      if(e.key === ";") {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Apply initial settings
    applyChamsSettings();
    animate();

    console.log("[EMULATION] Chams+ mod menu loaded and visible.");
  })();
})();
