Tabs.AI = {
    tabOrder: 910,
    tabLabel: 'AI Assistant',
    tabDisabled: false,
    myDiv: null,
    inputDiv: null,
    outputDiv: null,

    init: function (div) {
        var t = Tabs.AI;
        t.myDiv = div;
        t.createMainDiv();
    },

    createMainDiv: function () {
        var t = Tabs.AI;
        var m = '<DIV class=divHeader align=center>AI Assistant</div>';

        m += '<div style="padding:10px;">';
        m += '<input type="text" id="aiInput" style="width:100%;" placeholder="Ask me a question...">';
        m += '<button id="aiButton" style="width:100%; margin-top:5px;">Get Answer</button>';
        m += '<div id="aiOutput" style="margin-top:10px; border:1px solid #888; padding:10px; min-height:100px;"></div>';
        m += '</div>';

        t.myDiv.innerHTML = m;
        t.inputDiv = ById('aiInput');
        t.outputDiv = ById('aiOutput');

        ById('aiButton').addEventListener('click', function () {
            t.getAnswer();
        });

        t.inputDiv.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                t.getAnswer();
            }
        });
    },

    getAnswer: function () {
        var t = Tabs.AI;
        var question = t.inputDiv.value.trim();

        if (question !== '') {
            // Basic question answering logic (replace with your AI)
            var answer = t.processQuestion(question);
            t.outputDiv.innerHTML = answer;
        }
    },

    processQuestion: function (question) {
        // This is a placeholder for your AI logic.
        // For now, it just returns canned responses.
        question = question.toLowerCase();

        if (question.includes('resources')) {
            return "Make sure to build farms and mines to get more resources.";
        } else if (question.includes('attack')) {
            return "Train more troops and upgrade your castle before attacking.";
        } else {
            return "I'm still learning. Please ask another question.";
        }
    }
};
