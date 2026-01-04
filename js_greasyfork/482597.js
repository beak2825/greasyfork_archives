// ==UserScript==
// @name        R4 Utils
// @description R4 Utils Library
// @version     1.0.1
// ==/UserScript==
 
 
function R4Utils() {

    /* ------------------------------------------------- */
    /* --------------fromHTML--------------------------- */
    /* ------------------------------------------------- */

    function fromHTML(html, trim = true) {
        // Process the HTML string.
        html = trim ? html : html.trim();
        if (!html) return null;
      
        // Then set up a new template element.
        const template = document.createElement('template');
        template.innerHTML = html;
        const result = template.content.children;
      
        // Then return either an HTMLElement or HTMLCollection,
        // based on whether the input HTML had one or more roots.
        if (result.length === 1) return result[0];
        return result;
    }

    /* ------------------------------------------------- */
    /* --------------transliterate---------------------- */
    /* ------------------------------------------------- */

    function transliterate(word) {
        let answer = "";
        const a = {};

        a["Ё"] = "YO";
        a["Й"] = "I";
        a["Ц"] = "TS";
        a["У"] = "U";
        a["К"] = "K";
        a["Е"] = "E";
        a["Н"] = "N";
        a["Г"] = "G";
        a["Ш"] = "SH";
        a["Щ"] = "SCH";
        a["З"] = "Z";
        a["Х"] = "H";
        a["Ъ"] = "'";
        a["ё"] = "yo";
        a["й"] = "i";
        a["ц"] = "ts";
        a["у"] = "u";
        a["к"] = "k";
        a["е"] = "e";
        a["н"] = "n";
        a["г"] = "g";
        a["ш"] = "sh";
        a["щ"] = "sch";
        a["з"] = "z";
        a["х"] = "h";
        a["ъ"] = "'";
        a["Ф"] = "F";
        a["Ы"] = "I";
        a["В"] = "V";
        a["А"] = "A";
        a["П"] = "P";
        a["Р"] = "R";
        a["О"] = "O";
        a["Л"] = "L";
        a["Д"] = "D";
        a["Ж"] = "ZH";
        a["Э"] = "E";
        a["ф"] = "f";
        a["ы"] = "i";
        a["в"] = "v";
        a["а"] = "a";
        a["п"] = "p";
        a["р"] = "r";
        a["о"] = "o";
        a["л"] = "l";
        a["д"] = "d";
        a["ж"] = "zh";
        a["э"] = "e";
        a["Я"] = "Ya";
        a["Ч"] = "CH";
        a["С"] = "S";
        a["М"] = "M";
        a["И"] = "I";
        a["Т"] = "T";
        a["Ь"] = "'";
        a["Б"] = "B";
        a["Ю"] = "YU";
        a["я"] = "ya";
        a["ч"] = "ch";
        a["с"] = "s";
        a["м"] = "m";
        a["и"] = "i";
        a["т"] = "t";
        a["ь"] = "'";
        a["б"] = "b";
        a["ю"] = "yu";

        for (const i in word) {
            if (word.hasOwnProperty(i)) {
                answer += a[word[i]] === undefined ? word[i] : a[word[i]];
            }
        }
        return answer;
    }

    /* ------------------------------------------------- */
    /* --------------slugify---------------------------- */
    /* ------------------------------------------------- */

    function slugify(str) {
        return String(str)
            .normalize("NFKD") // split accented characters into their base characters and diacritical marks
            .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
            .trim() // trim leading or trailing whitespace
            .toLowerCase() // convert to lowercase
            .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
            .replace(/\s+/g, "-") // replace spaces with hyphens
            .replace(/-+/g, "-"); // remove consecutive hyphens
    }

    /* ------------------------------------------------- */
    /* --------------executeLocation-------------------- */
    /* ------------------------------------------------- */

    class AsyncLock {
        constructor () {
            this.release = () => {}
            this.promise = Promise.resolve()
        }
    
        acquire () {
            this.promise = new Promise(resolve => this.release = resolve)
        }
    }

    const execute_location_lock = new AsyncLock();

    function executeLocation(func, vars = {}, prefix = "ExecuteLocation", lock = execute_location_lock) {
        return new Promise((resolve, reject) => {

            // Wait for the lock to be released
            lock.promise.then(() => {

                // Acquire the lock
                lock.acquire();

                try {
                    // Convert the function to a string of code
                    const funcString = `(${func.toString()})()`;

                    // Define a new CustomEvent that will be dispatched when the function finishes executing
                    const eventName = prefix + Math.random().toString(36).substring(7);

                    // Listen for the function executed event
                    document.addEventListener(eventName, (event) => {

                        resolve(event.detail.result);

                        // Release the lock
                        lock.release();
                    });

                    // Convert the vars object to a string of code that defines these variables
                    const varsString = Object.entries(vars).map(([name, value]) => {
                        return `var ${name} = ${JSON.stringify(value)};`;
                    }).join('');

                    // Use location.assign to execute the function in the global scope
                    // The function result is sent as a CustomEvent
                    location.assign(`javascript:(function() {
                        ${varsString}
                        const result = ${funcString};
                        const event = new CustomEvent('${eventName}', { detail: { result: result } });
                        document.dispatchEvent(event);
                    })();void(0)`);
                    
                } catch (e) {
                    
                    reject(e);

                    // Release the lock in case of an error
                    lock.release();

                }
            });
        });
    }

    return {
        fromHTML,
        transliterate,
        slugify,
        executeLocation,
    };
}