// ==UserScript==
// @name            Hard Drugs
// @author          Altanis#8593
// @version         1.0.0
// @description     Fixed version of Nimdac's challenge script.
// @match           *://*.diep.io/*
// @grant           none
// @license        MIT
// @namespace https://greasyfork.org/users/947246
// @downloadURL https://update.greasyfork.org/scripts/449681/Hard%20Drugs.user.js
// @updateURL https://update.greasyfork.org/scripts/449681/Hard%20Drugs.meta.js
// ==/UserScript==

(function() {
    const i = setInterval(() => {
        if (input) onready();
        if (input.should_prevent_unload()) { startHell(); clearInterval(i); }
    }, 500);
    function onready() {
        // -- THEME -- //

        const getRatio = function() {
            if ((canvas.height * 16) / 9 >= canvas.width)
                return canvas.height;
            else
                return (canvas.width * 16) / 9
        },
              isMinimap = function(x, y) {
                  const r = getRatio();
                  if ((x >= (canvas.width) - (r * 0.2)) && (y >= (canvas.height) - (r * 0.2)))
                      return true;
                  else
                      return false;
              };

        const black = [0, 1, 2, 8, 9, 10, 11, 12, 13, 14, 16, 17, 'ren_score_bar_fill_color', 'ren_bar_background_color', 'ren_border_color', 'ren_health_background_color', 'ren_background_color', 'ren_minimap_background_color', 'ren_xp_bar_fill_color'];

        black.forEach(function(i) {
            parseInt(i) ?
                input.execute(`net_replace_color ${i} 0x000000`)
            : input.execute(`${i} 0x000000`);
        });

        input.set_convar('ren_stroke_soft_color', false);

        var white = [
            'net_replace_color 15',
            'ren_stroke_solid_color',
            'ren_health_fill_color',
        ];

        white.forEach(function(i) {
            input.execute(`${i} 0xFFFFFF`);
        });

        input.execute(`ui_replace_colors 0xFFFFFF 0xFFFFFF 0xFFFFFF 0xFFFFFF 0xFFFFFF 0xFFFFFF 0xFFFFFF 0xFFFFFF`);

        const crx = CanvasRenderingContext2D.prototype;


        crx.fillText = new Proxy(crx.fillText, {
            apply(f, _this, args) {
                if (!['This is the tale of...', 'Health Regen', 'Max Health', 'Body Damage', 'Bullet Speed', 'Bullet Penetration', 'Bullet Damage', 'Drone Speed', 'Drone Penetration', 'Drone Damage', 'Reload', 'Movement Speed', 'Score:', 'Level:', 'Time Alive:'].includes(args[0])
                    && !parseInt(args[0])
                    && !args[0].includes('Score')) return;

                if (args[0] === atob('U2NvcmU6')) args[0] = atob('U2NvcmU=');
                f.apply(_this, args);
            }
        });
        crx.strokeText = new Proxy(crx.strokeText, {
            apply(f, _this, args) {
                if (!['This is the tale of...', 'Health Regen', 'Max Health', 'Body Damage', 'Bullet Speed', 'Bullet Penetration', 'Bullet Damage', 'Drone Speed', 'Drone Penetration', 'Drone Damage', 'Reload', 'Movement Speed', 'Score:', 'Level:', 'Time Alive:'].includes(args[0])
                    && !parseInt(args[0])
                    && !args[0].includes('Score')) return;

                if (args[0] === atob('U2NvcmU6')) args[0] = atob('U2NvcmU=');
                f.apply(_this, args);
            }
        });
        crx.drawImage = new Proxy(crx.drawImage, { apply(f, _this, args) { if (args[0].width < 50 && args[0].height < 50) return; f.apply(_this, args); } });
    }

    function startHell() {
        // -- CANVAS EFFECT -- //
        for (let i of ['mousedown', 'mouseup']) {
            document.addEventListener(i, e => e.isTrusted && canvas.dispatchEvent(new MouseEvent(e.type, e)))
        };

        canvas.style.opacity = 0;

        const seizure = document.createElement('canvas'),
              ctx = seizure.getContext('2d');
        function resize() {
            seizure.width = window.innerWidth * window.devicePixelRatio;
            seizure.height = window.innerWidth * window.devicePixelRatio;
        }
        resize();
        window.addEventListener('resize', resize);

        seizure.style.filter = 'grayscale(100%) brightness(25%)';
        seizure.style.position = 'absolute';
        document.body.appendChild(seizure);

        let add = false,
            i = 0;
        setInterval(() => {
            if (i === 0 || i === 100) add = !add;
            add ? i++ : i--;
        }, 16);

        const loop = function() {
            seizure.style.zIndex = -1;

            let distance = canvas.width / 1000 * i;
            ctx.clearRect(0, 0, seizure.width, seizure.height);
            ctx.globalCompositeOperation = "lighter";

            ctx.drawImage(canvas, distance, distance);
            ctx.drawImage(canvas, -distance, distance);
            ctx.drawImage(canvas, distance, -distance);
            ctx.drawImage(canvas, -distance, -distance);

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }
})();