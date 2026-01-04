if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand('About', () => {
        Swal.fire({
            title: GM_info.script.name,
            html: `
                <strong>Version: ${GM_info.script.version}</strong><br>
                <strong>Author: Kurotaku</strong><br>
                <strong>Homepage:</strong> <a href="https://kurotaku.de" target="_blank">kurotaku.de</a><br><br>
                <strong>Check out my other Userscripts:</strong><br>
                <a href="https://github.com/Kurotaku-sama/Userscripts" target="_blank">GitHub Overview</a> |
                <a href="https://gist.github.com/Kurotaku-sama" target="_blank">Gist Github</a><br><br>
                If you encounter any issues, feel free to DM me on Discord: <b>Kurotaku</b>
                ${ko_fi}
                `,
            theme: "dark",
            backdrop: false
        });
    });
}

function sort_alphabetically(text) {
    return text.split('\n').sort().join('\n');
}

function random_number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_int() {
    return Math.floor(Math.random() * (10000000 - 0) + 0);
}

function random_string(length, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    const characters_length = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters_length));
        counter += 1;
    }
    return result;
}

function randomize_case(text) {
    return text.split('').map(function(letter) {
        return Math.random() < 0.5 ? letter.toUpperCase() : letter.toLowerCase();
    }).join('');
}

function trim_spaces(text) {
    let lines = text.split("\n");
    let temp = [];
    lines.forEach((item) => {
        temp.push(item.trim());
    });
    return temp.join("\n");
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function sleep_s(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function sleep_m(minutes) {
    return new Promise(resolve => setTimeout(resolve, minutes * 1000 * 60));
}

function download_table_as_csv(id) {
    let table_id = id, separator = ';'

    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function animate_number_counter(element, start, end, duration = 1000) {
    const start_time = performance.now();

    const animate = (time) => {
        const progress = Math.min((time - start_time) / duration, 1);
        element.textContent = `${Math.floor(start + (end - start) * progress)}`;
        if (progress < 1) requestAnimationFrame(animate);
    };
    // Start the animation
    requestAnimationFrame(animate);
    // Wait for the animation to finish
    await sleep(duration);
}

// This function is to wait for the GM Config to avoid Chromium based error
function wait_for_gm_config() {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            if (typeof GM_config !== "undefined" && GM_config.get) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}

function wait_for_element(selector) {
    return new Promise(resolve => {
        const node = document.querySelector(selector);
        if (node) return resolve(node);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function wait_for_element_to_disappear(selector) {
    return new Promise(resolve => {
        const node = document.querySelector(selector);
        if (!node) return resolve();

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (!el) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const ko_fi = `
<a href="https://ko-fi.com/kurotaku1337" target="_blank" rel="noopener" class="kofi-button">
  <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi cup" class="kofi-icon" />
  <span class="kofi-text">If you like my work feel free<br>to support me on Ko-fi</span>
  <div class="kofi-shine"></div>
</a>

<style>
  .kofi-button {
    margin-top: 15px;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    background: linear-gradient(135deg, #6a1292, #c850c0);
    border-radius: 12px;
    padding: 10px 20px;
    color: white;
    font-size: 13px;
    font-family: "Segoe UI", sans-serif;
    font-weight: bold;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
  }
  
  .kofi-button:visited {
    text-decoration: none;
    color: white;
  }

  .kofi-button:hover {
    transform: translateY(-4px) scale(1.03) rotateX(5deg);
    box-shadow: 0 12px 24px rgba(0,0,0,0.25);
    text-decoration: none;
    color: white;
  }

  .kofi-icon {
    height: 32px;
    width: auto;
    display: block;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
    transition: transform 0.3s ease-in-out;
  }

  .kofi-text {
    position: relative;
    text-align: center;
    color: white;
  }

  .kofi-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
    transform: rotate(25deg);
    pointer-events: none;
    animation: kofi_shine 3s infinite linear;
  }

  @keyframes kofi_shine {
    0% { transform: translateX(-100%) rotate(25deg); }
    100% { transform: translateX(100%) rotate(25deg); }
  }

  @keyframes kofi_shake_icon {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
    75% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); }
  }

  .kofi-button:hover .kofi-icon {
    animation: kofi_shake_icon 2s ease-in-out infinite;
  }

  @keyframes kofi_shake_icon {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(-10deg); }
    20% { transform: rotate(10deg); }
    30% { transform: rotate(-10deg); }
    40% { transform: rotate(10deg); }
    50% { transform: rotate(0deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  }
</style>
`;