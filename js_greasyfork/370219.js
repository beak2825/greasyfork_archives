var buttonsBar = (function () {
    //add the button
    function addButton(ID, name, onclick) {
        //add the bar if there is none
        if (!$('#buttonsBar').length) addBar()
        //append the button
        var button = $('<div class="barButton"><input id="' + ID + '" type="button" value="' + name + '"></div>')
        button.on('click', onclick)
        $('#buttonsBar .flexWrapper').append(button)
    }

    //adds the bar with buttons
    function addBar() {
        var bg = ''
        var cls = $('body')[0].className
        if (cls.includes('modern-dark')) bg = '#424242'
        else if (cls.includes('modern')) bg = '#f5f5f6'
        else if (cls.includes('light')) bg = '#e6e6e6'
        else bg = 'rgba(25,34,49,0.8)'
        $('.progress-bars-holder').before('<div id="buttonsBar"><div class="flexWrapper"</div></div>')
        $('head').append(
            `<style id="ButtonBarStyle">
                @media (max-width: 480px) {
                    #buttonsBar .barButton {
                        height: 30px;
                        font-size: 12px;
                    }
                }
                #buttonsBar {
                    margin-top: 2.5px;
                }
                #buttonsBar .flexWrapper {
                    height: 40px;
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -2.5px;
                    width: calc(100% + 5px);
                }
                #buttonsBar .barButton {
                    flex: 1;
                    margin: 2.5px;
                }
                #buttonsBar .barButton input {
                    background: ${bg};
                    height: 100% !important;
                    color: black;
                    border: 0;
                }
                #buttonsBar .barButton input:hover {
                    color: rgb(103, 114, 124);
                }
                </style>`,
        )
    }
    return { addButton: addButton }
})()
