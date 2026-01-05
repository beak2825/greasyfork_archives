var _gwCalling = null;
var _gwAuthor = null;

//Updates the localStorage with the new values
function spStoreValue( mainId, charId, cbbId )
{
    //Gets the value for the given cbbId
    var tmpValue = 24;
    if( typeof document.getElementById( cbbId ) != 'undefined' ) {
	tmpValue = document.getElementById( cbbId ).value;
    }

    storedValues = JSON.parse( window.localStorage.getItem( mainId ) );
    storedValues[charId] = tmpValue;
    window.localStorage.setItem( mainId, JSON.stringify( storedValues ) );
}

// Calls everyone in the contact list
function spCallEveryone( mainId )
{
    itemListId = 1;
    _gwCalling = window.open( '', 'gexWindow', '' );
    var toCall = JSON.parse( window.localStorage.getItem( mainId ) );
    
    var doit = function( key )
    {
	var tmpitemListId = itemListId;
	if( tmpitemListId <= 9 ) {
	    tmpitemListId = 'ctl00_cphLeftColumn_ctl00_repAddressBook_ctl0' + tmpitemListId + '_lnkCharacter';
	} else {
	    tmpitemListId = 'ctl00_cphLeftColumn_ctl00_repAddressBook_ctl' + tmpitemListId + '_lnkCharacter';
	}
	var callObject = document.getElementById( tmpitemListId );
	var callUrl = 'http://' + window.location.hostname + callObject.getAttribute( "href" );
	_gwCalling.location = callUrl;
	itemListId++;
    };
    
    var i = 0;
    for( var key in toCall ) {
	( function()
	{
	    var k = key;
	    setTimeout( 
		function() 
		{
		    doit( key );
		}, 8000 * i );
	} )();
	i += 1;
    }
}

// Create a contact Private Message to the author of the script
function contactAuthor()
{
    _gwAuthor = window.open( '', 'gexAuthor', '' );
    _gwAuthor.location = 'http://' + window.location.hostname + '/World/Popmundo.aspx/Conversations/Conversation/3248185';
}