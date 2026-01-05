/*** Mutation Detective ***/
var ngaMDTarget = document.querySelector('body');
var ngaPage = [
    ['Login',		'.login-page div#form input', ngaLoginPage], //#content_login - causes errors!!!
    ['Dungeons',	'#content_dungeons'],
    ['Hero',		'#content_charactersheet'],
    ['Inventory',	'#content_inventory'],
    ['Professions', '#content_professions'],
    ['AH',			'#content_auction'],
    ['ZEX',			'#content_exchange'],
    ['Guild',		'#content_guild'],
    ['Mail',		'#content_mail']
];
ngaMDoptions = {'childList': true, 'subtree': true};
var ngaMD = new MutationObserver(function(allmutations) {
    allmutations.map(function(mr) {
        ngaPage.forEach(function testPage(pagedata) {
            var node2check = document.querySelector(pagedata[1]);
//            var attr2check = node2check.getAttribute('ngAdvanced');
            if (node2check){
//                console.log(pagedata[0] + ' page detected.');
                if(pagedata[2]){pagedata[2]();}
//                else {console.log('No defined function for ' + pagedata[0]);}
            }
        });
    });
});
    
function ngaMDGo() {ngaMD.observe(ngaMDTarget, ngaMDoptions);console.log ('Mutation observer ngaMD initiated');}
function ngaMDStop() {ngaMD.disconnect();console.log ('Mutation observer ngaMD stopped');}
/** EndOf Mutation Observer**/
