function logger(content, type = "log") {
    switch (type) {
        case "log": {
            var css = "background: #6495ED;";
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
        case "warn": {
            var css = "background: #FF6600; color: black;"
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
        case "error": {
            var css = "background: #FF0066"
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
        case "debug": {
            var css = "color: #66FF00;"
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
        case "cmd": {
            var css = "background: #FFFFFF; color: black;"
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
        case "ready": {
            var css = "background: #66FF00; color: black;"
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
        case "disconnect": {
            var css = "background: #FF0066"
            return console.log(`%c${type.toUpperCase()}`, `${css}`, `${content}`);
        }
    }
};