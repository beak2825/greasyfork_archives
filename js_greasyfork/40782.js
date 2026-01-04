function addStyles() {
    if (document.getElementById("email-quotes")) {
        console.log("Styles for e-mail quote highlighting already added, doing nothing");
        return;
    }
    console.log("Adding styles for e-mail quote highlighting");
    var styleNode = document.createElement('style');
    styleNode.setAttribute("type", "text/css");
    styleNode.id = "email-quotes";
    styleNode.innerHTML =
        'mark.quote1 { background: #eee }\n' +
        'mark.quote2 { background: #eef }\n' +
        'mark.quote3 { background: #efe }\n' +
        'mark.quote4 { background: #fee }\n' +
        'mark.quote5 { background: #ddd }\n' +
        'mark.quote6 { background: #ddf }\n' +
        'mark.quote7 { background: #dfd }\n' +
        'mark.quote8 { background: #fdd }\n';
    document.body.appendChild(styleNode);
}

function highlightQuotes() {
    addStyles();
    if (
        document.getElementsByClassName("quote1").length ||
        document.getElementsByClassName("quote2").length ||
        document.getElementsByClassName("quote3").length ||
        document.getElementsByClassName("quote4").length ||
        document.getElementsByClassName("quote5").length ||
        document.getElementsByClassName("quote6").length ||
        document.getElementsByClassName("quote7").length ||
        document.getElementsByClassName("quote8").length
    ) {
        console.log("E-mail quotes already highlighted, doing nothing");
        return;
    }
    console.log("Highlighting e-mail quotes");
    var context = document.querySelector("pre,blockquote,.Wordsection1,.MsoPlainText,body");
    var instance = new Mark(context);
    instance.markRegExp(/^(> *){1}([^>\n].*|)$/gm, {"className" : "quote1" });
    instance.markRegExp(/^(> *){2}([^>\n].*|)$/gm, {"className" : "quote2" });
    instance.markRegExp(/^(> *){3}([^>\n].*|)$/gm, {"className" : "quote3" });
    instance.markRegExp(/^(> *){4}([^>\n].*|)$/gm, {"className" : "quote4" });
    instance.markRegExp(/^(> *){5}([^>\n].*|)$/gm, {"className" : "quote5" });
    instance.markRegExp(/^(> *){6}([^>\n].*|)$/gm, {"className" : "quote6" });
    instance.markRegExp(/^(> *){7}([^>\n].*|)$/gm, {"className" : "quote7" });
    instance.markRegExp(/^(> *){8,}([^>\n].*|)$/gm, {"className" : "quote8" });
}
