// ==UserScript==
// @name        LSA Ignore List Extension
// @author      Minimal (LSA ID:147190 )
// @namespace   https://greasyfork.org/en/users/13298-minimal  
// @description An extension that allows users to input a reason as to why a user was ignored.
// @include     http://www.lipstickalley.com/profile.php?do=ignorelist*
// @include		http://www.lipstickalley.com/showthread.php/*
// @include     http://www.lipstickalley.com/profile.php?do=removelist&userlist=ignore&u=*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11033/LSA%20Ignore%20List%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/11033/LSA%20Ignore%20List%20Extension.meta.js
// ==/UserScript==

var remove = [];					
    remove.push(false);

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
/* |										 indexedDB			   							        | */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
var dbName = "ignorelistDB";
var ver = 1.0;
var il_DB = {};
var indexedDB = window.indexedDB || 
				window.webkitIndexedDB || 
                window.mozIndexedDB;

// -----------------------------------------------------------------------------
// Determine if the indexedDB exists in the window object
// -----------------------------------------------------------------------------
if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.IDBTransaction || 
							window.webkitIDBTransaction || 
							window.mozIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || 
						 window.webkitIDBKeyRange || 
						window.mozIDBKeyRange;
}//end if(...)

il_DB.indexedDB = {};
il_DB.indexedDB.db = null;

il_DB.indexedDB.onerror = function ( e )
{   console.log("ERROR: " + e);				console.dir( e );   } 

// ----------------------------------------------------------------------------------------------------
/*
 * Open the indexedDB; Apply upgrades when necessary. 
 */
il_DB.indexedDB.open = function (){
	var req = indexedDB.open(dbName, ver);
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++ generateDB: ON UPGRADE NEEDED ++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	req.onupgradeneeded = function ( e ){
		console.log("--- Begin onUpgradeNeeded ---");
		
		var db = il_DB.indexedDB.db = e.target.result;
		
		if ( db.objectStoreNames.contains("USERLIST") )
		{	db.deleteObjectStore("USERLIST" );   }
		
		var store = db.createObjectStore("USERLIST", {keyPath:"userID"});
			  store.createIndex("userID", "userID", { unique: true } );

		console.log("---  End onUpgradeNeeded  ---");	
		db.close();
	};// end onupgradeneeded function() {...}
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++ generateDB: ON SUCCESS +++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	req.onsuccess = function( e ){
        console.log ("[---> Success for : " + dbName + " <---]");
	    var db = il_DB.indexedDB.db = e.target.result;
	    db.close();
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++ generateDB: ON ERROR +++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	req.onerror = il_DB.indexedDB.onerror;
};// end open {...}

// ----------------------------------------------------------------------------------------------------
/*
 * Adds a user to the indexedDB
 *
 * @param  id       the id of a user
 * @param  r		the reason for ignoring a user
 */
il_DB.indexedDB.add = function(id, r) {
	var req = indexedDB.open(dbName, ver);

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ add: ON SUCCESS +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	req.onsuccess = function ( e ){
		var db = il_DB.indexedDB.db = e.target.result;
		var trans = db.transaction( ['USERLIST'], "readwrite" );
		var store = trans.objectStore("USERLIST");

		// -------------------------------------------------------------------------
		// Create a new user object to store in database.
		// -------------------------------------------------------------------------		
		var user = {   "userID": id, "reason": r   };
		var req = store.put( user );

		req.onsuccess = function( e )
		{   console.error("---> Success: ", e);				db.close();   };

		req.onerror = function ( e )
		{   console.error("---> Error Adding/Updating : ", e);   };
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++++ add: ON ERROR ++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onerror = il_DB.indexedDB.onerror;
	
};// end add {...}

// ----------------------------------------------------------------------------------------------------
/*
 * Removes a user from the indexedDB
 *
 * @param  id        the id of a user
 */
il_DB.indexedDB.remove = function(id){
	var req = indexedDB.open(dbName, ver);

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++ remove: ON SUCCESS ++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onsuccess = function ( e ){
		var db = il_DB.indexedDB.db = e.target.result;

		var trans = db.transaction( ['USERLIST'], "readwrite" );
		var store = trans.objectStore("USERLIST");
		var req = store.delete( id );

		req.onsuccess = function( e )
		{   console.error("---> Removed: ", e);					db.close();   };

		req.onerror = function( e )
		{   console.error("---> Error Removing: ", e);   };
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++ remove: ON ERROR +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onerror = il_DB.indexedDB.onerror;
	
};// end remove {...}

// ----------------------------------------------------------------------------------------------------

/*
 * Searches for a user and (if found) places the reason in the correct context.
 *
 * @param  id         the id of a user
 * @param  c		  the context on the page
 */
il_DB.indexedDB.find = function(id, c){
	var req = indexedDB.open(dbName, ver);
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ get: ON SUCCESS +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onsuccess = function( e ){
		var db = il_DB.indexedDB.db = e.target.result;
		var r;
		
		var trans = db.transaction( ['USERLIST'], "readonly" );
		var store = trans.objectStore("USERLIST"); 
		var index = store.index("userID");
		
		var req = index.get( id );
		
		req.onsuccess = function( e ){
			if ( e.target.result == null ) {   r = null;   }
			else						   {   r = e.target.result.reason;   }
			
			// -------------------------------------------------------------------------
			// Position reason in the correct area on the page.
			// -------------------------------------------------------------------------
			if (r != null){
				var p = document.createElement('p');
					p.innerHTML = "<br>" + 
								  "<b>Reason:</b> " + r +
								  "<br><br>";

				c[1].parentNode.insertBefore(p, c[1]);
				console.error("---> Located: ", e);    
			}// end if(!=...)

			db.close();
		};
		
		req.onerror = function( e ) 
		{   console.error("---> Error Finding: ", e);   };
	};
	
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++++ get: ON ERROR ++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onerror = il_DB.indexedDB.onerror;
	
};// end find{...}

// ----------------------------------------------------------------------------------------------------
/*
 * Searches for a user and (if found) places the reason in the corrext cell. 
 * Applies update to the button element.
 *
 * @param  rs		  the cell that holds the reason content
 * @param  bs		  the cell that holds the button content
 */
il_DB.indexedDB.get = function( rs, bs ){
	var req = indexedDB.open(dbName, ver);

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++ get: ON SUCCESS +++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onsuccess = function( e ){
		var db = il_DB.indexedDB.db = e.target.result;
		
		var trans = db.transaction( ['USERLIST'], "readonly" );
		var store = trans.objectStore("USERLIST"); 
		var index = store.index("userID");
		
		var req = index.get( rs.id );
		
		req.onsuccess = function( e ){	
			// -------------------------------------------------------------------------
			// If the user is not found, display default reason. Otherwise, update 
			// cell with stored reason.
			// -------------------------------------------------------------------------
			if ( e.target.result == null )
			{   rs.innerHTML = "<i>No Reason</i>";		  bs.value = "Add Reason";   }
			else 
			{   rs.innerHTML = e.target.result.reason;    bs.value = "Edit Reason";   }
			
			console.error("---> Found: ", e);
			db.close();
		};
		
		req.onerror = function( e )
		{   console.error("---> Error Retrieving: ", e);   };
	};

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// ++++++++++++++++++++++++++++++ get: ON ERROR ++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	req.onerror = il_DB.indexedDB.onerror;
	
};// end get {...}

/* ================================================================================================== */
/* |											INITIALIZE 											| */
/* ================================================================================================== */

if ( location.href.indexOf('ignorelist') > 0 )
{   il_DB.indexedDB.open();			generateTable();		submitData();   }

if ( location.href.indexOf('showthread') > 0 )
{   il_DB.indexedDB.open();			displayReason();   }

if (location.href.indexOf('removelist') > 0) 
{   il_DB.indexedDB.open();			removeUser();   }

/* ================================================================================================== */
/* |										 END INITIALIZE 										| */
/* ================================================================================================== */

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
/* |										 submitData()     			   					        | */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
/*
 * Submits changes made by the user; Fetch information from the server and reload. 
 */
function submitData(){
	var save = document.getElementById('submit_save');
	var add = document.querySelectorAll("input[value=Okay]")[0];

	submit_ChangeData( save );							submit_AddData( add );

	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
	/* +++++++++++++++++++++++++++ submitData() PRIVATE FUNCTIONS AND METHODS  ++++++++++++++++++++++++++ */		
	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */	

    /*
	 * Submits data to the server (i.e. User is deleted) 
	 *
	 * @param  b        button element
	 */		
	function submit_ChangeData(b){
		b.onclick = function () {
			// All user's are deleted; Database is no longer in use.
			if ( remove[0] == true ) {   indexedDB.deleteDatabase(dbName);   }
			
			// Otherwise delete user's selected.
			else {
				for (var i = 1; i < remove.length; i++)
				{   il_DB.indexedDB.remove( remove[i] );   }
			}// end else{...}
			
			document.forms["ignorelist_change_form"].submit();   
		};//end onclick{...}	
	}// end submit_ChangeData(...)

	// ----------------------------------------------------------------------------------------------------
    /*
	 * Submits data to the server (i.e. User is added) 
	 *
	 * @param  b        button element
	 */			
	function submit_AddData(b){
		b.onclick = function () {   document.forms["ignorelist_add_form"].submit();   };   
	}// end submit_AddData(...)
	
}// end submitData() {...}

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
/* |										  generateTable()									    | */
/* \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ */
/*
 * Redesigns the Ignore List block; transfers information into a table. New 
 * functionality added.
 */	
function generateTable(){
	var userListContainer = document.getElementsByClassName('userlist floatcontainer');
	var section = $(userListContainer).parent();
	
	// -----------------------------------------------------------------------------
	// Step 1:
	// Create a new Table Element, complete with headers and required columns.
	// Position Table in correct area on the page.
	// -----------------------------------------------------------------------------
	var table = document.createElement('table');
		table.className = table.id = 'UserListTable';
		
	var headerRow = document.createElement('tr');
	    headerRow.id = 'thr';

	var userListColumn = document.createElement('th');
	    userListColumn.class = 'ult-h';
	   	userListColumn.id = 'ulc';
		userListColumn.style.width = '20%';
	  	userListColumn.textContent = "USER";
	
	var reasonColumn = document.createElement('th');
	  	reasonColumn.id = 'urc';
	    reasonColumn.class = 'ult-h';
	    reasonColumn.textContent = "REASON";
	
	var add_editColumn = document.createElement('th');
	    add_editColumn.class = 'ult-h';
	  	add_editColumn.id = 'ult-aec';
	    add_editColumn.style.width = '11%';
	    add_editColumn.innerHTML = "<center>ADD | EDIT</center>"; 
	
	headerRow.appendChild( userListColumn );			  headerRow.appendChild( reasonColumn );
    headerRow.appendChild( add_editColumn );
	
	table.appendChild(headerRow);						  section.prepend(table);
	
	// -----------------------------------------------------------------------------
	// Step 2:
	// Create individual rows for each user.
	// Transfer data presented on the page into the User List Table.
	// -----------------------------------------------------------------------------	
	var row, 					// Row for each User
		userNameSection, 		// Cell holds username hyperlink, and checkbox
		reasonSection, 			// Cell holds dynamic string
		buttonSection, 			// Cell holds button w/ prompt
		cloned_li;					

	var usersArray = userListContainer.ignorelist.getElementsByTagName('li');
	
	if ( usersArray.length > 1 ) { 
		for( var i = 0; i < usersArray.length-1; i++){
			// -----------------------------------------------------------------------------
			// Create a new row.
			// -----------------------------------------------------------------------------			
			row = document.createElement('tr');
			row.id = 'User #' + (i+1);

			// -----------------------------------------------------------------------------
			// Create a copy of the list item that appears in the original div.
			// -----------------------------------------------------------------------------					
			cloned_li = cloneListItem( usersArray[i] );

			// -----------------------------------------------------------------------------
			// Create a cell to hold the user's username.
			// -----------------------------------------------------------------------------					
			userNameSection = document.createElement('td');
			userNameSection.id = cloned_li.id;
			userNameSection.className = 'u-cell';
			userNameSection.appendChild( cloned_li ); 

			// -----------------------------------------------------------------------------
			// Create a cell that will hold the reason for blocking a user.
			// -----------------------------------------------------------------------------					
			reasonSection = document.createElement('td');
			reasonSection.id = cloned_li.children[0].value;
			reasonSection.className = cloned_li.id;

			// -----------------------------------------------------------------------------
			// Create a cell that will hold the button that the user can interact with
			// to add a reason to the previous cell.
			// -----------------------------------------------------------------------------					
			buttonSection = document.createElement('td');
			createButton( buttonSection, 
						  reasonSection, 
						  usersArray[i].children[1].innerHTML,
						  usersArray[i].children[0].value );		
			il_DB.indexedDB.get( reasonSection, buttonSection.children[0] );

			// -----------------------------------------------------------------------------
			// Position elements in table
			// -----------------------------------------------------------------------------		
			row.appendChild( userNameSection );				row.appendChild( reasonSection );	
			row.appendChild( buttonSection );	

			table.appendChild( row );	
		}// end for(i=...)

		// -----------------------------------------------------------------------------
		// Step 3:
		// Append Table Footer, which will contain the Checkbox Element to select
		// or deselect all user checkboxes in the User List Table.
		// -----------------------------------------------------------------------------	
		var footer = document.createElement('tfoot');
		var footerRow = document.createElement('tr');

		table.appendChild( footerRow );						table.appendChild( footer );
		add_CheckAll( footer );
	}// end if{...}

	// -----------------------------------------------------------------------------
	// Step 4:
	// Add styling to the User List Table.
	// -----------------------------------------------------------------------------	
	styleTable();

	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
	/* +++++++++++++++++++++++++ generateTable() PRIVATE FUNCTIONS AND METHODS  +++++++++++++++++++++++++ */		
	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
	
	// ----------------------------------------------------------------------------------------------------
    /*
	 * Creates a deep copy of a list item. 
	 *
	 * @param  li       the list item to be duplicated
	 * @return          copy of the list item
	 */	
	function cloneListItem(li){
		var c_li = document.createElement('li');
		    c_li.setAttribute('id', li.id);

		// -----------------------------------------------------------------------------
		// Create a deep copy of the Checkbox Element
		// -----------------------------------------------------------------------------
	  var newCheckBoxElement = document.createElement('input');
	      newCheckBoxElement.setAttribute('type', li.children[0].type);
	      newCheckBoxElement.setAttribute('name', li.children[0].name);
	      newCheckBoxElement.setAttribute('id', li.children[0].id);
          newCheckBoxElement.setAttribute('value', li.children[0].value);      
    	  newCheckBoxElement.setAttribute('checked', true);
    	  newCheckBoxElement.style.margin="2px 6px 0px 2px";
    	  newCheckBoxElement.onclick = function (){
            if ( newCheckBoxElement.checked ) {   li.children[0].checked = true;  
    											  restoreUser( li.children[0].value );   }
    		else			  	              {   li.children[0].checked = false; 
    	    									  deleteUser( li.children[0].value );   }
    	    };

		// -----------------------------------------------------------------------------
		// Create a deep copy of the Hyperlink Element
		// -----------------------------------------------------------------------------		
		var newLink = document.createElement('a');	
	        newLink.setAttribute('href', li.children[1].href);
		    newLink.innerHTML = li.children[1].innerHTML;
	        newLink.onmouseover = function() {   newLink.style.color = "#323232";   };
			newLink.onmouseout = function()  {   newLink.style.color = '';   };
			
		// -----------------------------------------------------------------------------
		// Create a deep copy of the ListBits Input Element
		// -----------------------------------------------------------------------------	
		var newListBits = document.createElement('input');
	        newListBits.setAttribute('type', li.children[2].type);
	    	newListBits.setAttribute('name', li.children[2].name);
	    	newListBits.setAttribute('value', li.children[2].value);
	
		// -----------------------------------------------------------------------------
		// Build and return duplicated list item.
		// -----------------------------------------------------------------------------			
		c_li.appendChild( newCheckBoxElement );				c_li.appendChild( newLink );
		c_li.appendChild( newListBits );
	
		return c_li;
	}// end cloneListItem(...)

	// ----------------------------------------------------------------------------------------------------
    /*
	 * Stores a user in an array to be deleted a later time.
	 *
	 * @param  id			  the id number of a user
	 */	
	function deleteUser(id) {   remove[0] = false;   remove.push( id );   }
	
	// ----------------------------------------------------------------------------------------------------
    /*
	 * Removes a user that appeared in the array; User will not be deleted 
	 * when form is submitted
	 *
	 * @param  id			  the id number of a user
	 */		
	function restoreUser(id){
		remove[0] = false;
		var i = remove.indexOf( id );					// Locate user in the array
		if ( i == -1 ) {   return;   }					// User is not in the array
		remove.splice( i , 1 );							// Otherwise, remove entry in array
	}// end restoreUser(...)
	
	// ----------------------------------------------------------------------------------------------------
    /*
	 * Update flag in array to delete all user's.
	 */		
	function deleteAll(){   
		remove[0] = true;   
		
		// Remove any user's that may appear in the array.
		if ( remove.length > 1 )
		{   remove.splice( 1, remove.length-1 );   }
	}// end deleteAll()
	
	// ----------------------------------------------------------------------------------------------------
    /*
	 * Update flag in array so all user's are restored.
	 */	
	function restoreAll(){   remove[0] = false;   }
	
	// ----------------------------------------------------------------------------------------------------
    /*
	 * Creates a button which will appear in the ADD | EDIT column for each user. When clicked
	 * the button triggers a prompt dialog, which will allow the user to type and store their 
	 * input in the REASON column of the table and store the information in the database.
	 *
	 * @param  c        the cell where the button will be placed
	 * @param  rs       the pointer to the cell which holds the reason for blocking a user
	 * @param  u        the user's username (a static string)
	 * @param  id		the id number of a user
	 */
	function createButton(c, rs, u, id){
    var b = document.createElement('input');
		
	  b.type = "button";
	  b.style.margin = "8%";
	  b.onclick = function(){
		// -----------------------------------------------------------------------------
		// Prompt user to input reason. Update cell and store information in database.
		// -----------------------------------------------------------------------------
		var r = prompt("Input reason for ignoring " + u + " :").trim();
		if ( r == '' )   {   r = null;   }
		if ( r != null ) {   rs.textContent = r;		il_DB.indexedDB.add(id, r);   }
		};// end onclick{...}
	
    c.appendChild( b );
	}// end createButton(...)
	
	// ----------------------------------------------------------------------------------------------------
    /*
	 * Transfers functionality from the original "Check / Uncheck Users" Checkbox Element to a 
	 * new Checkbox Element. New Checkbox Element controls the user checkboxes in the redesigned
	 * User List Table.
	 *
	 * @param  ftr      the footer cell where the New Checkbox Element will be placed
	 * @param  ptr      the pointer to the original "Check / Uncheck Users" Checkbox Element
	 */
	function add_CheckAll(ftr, ptr){
		var e = null;
		var cbs = [];

		// -----------------------------------------------------------------------------
		// Search for and store the required checkbox elements.
		// -----------------------------------------------------------------------------
		var allInputs = document.getElementsByTagName('input');

		for (var i = 0; i < allInputs.length; i++){
			// Locate "Check / Uncheck Users" Checkbox Element
			if ( allInputs[i].type == 'checkbox' && 
				 allInputs[i].id == "ignorelist_checkall" )
			{   e = allInputs[i];   }

			// Locate all original user Checkbox elements and store them.
			if ( allInputs[i].id.match(/^usercheck/) )
			{ 	cbs.push( allInputs[i] );   }
		}// end for(var i =0...)

		// -----------------------------------------------------------------------------
		// Create a new Checkbox Element. Add correct click functionality to control 
		// user checkboxes in User List Table.
		// -----------------------------------------------------------------------------
		var newCheckAllBox = document.createElement('input');
			newCheckAllBox.setAttribute('type', 'checkbox');
		    newCheckAllBox.style.margin="2px 6px 0px 2px";
			newCheckAllBox.setAttribute('id', 'new_ignorelist_checkall');
			newCheckAllBox.setAttribute('checked', true);
			newCheckAllBox.onclick = function (){
				if ( newCheckAllBox.checked ){
					for (var i = 0; i<cbs.length; i++)
					{   cbs[i].checked = true;   e.checked = true;   }
					restoreAll();
				}// end if {...}
				else {
					for (var i = 0; i<cbs.length; i++)
					{   cbs[i].checked = false;   e.checked = false;   }
					deleteAll();
				}// end else {...}
			};// end onclick {...}

		// -----------------------------------------------------------------------------
		// Add Checkbox to footer, create a Label, and hide the original 
		// "Check / Uncheck Users" Checkbox.
		// -----------------------------------------------------------------------------		
		ftr.appendChild( newCheckAllBox );
		ftr.appendChild( document.createTextNode("Check | Uncheck All Users") );
		e.parentNode.parentNode.style.display = 'none';
	}// end add_CheckAll(...)	
	
	// ----------------------------------------------------------------------------------------------------
	/*
	 * Applies the appropriate styling properties to the Ignore List Table. 
	 */
    function styleTable() {
		var s = document.createElement('style');
		
		var sectionStyle = section.parent();
		sectionStyle = sectionStyle[0];
		sectionStyle.style.padding = "0px";
		updateDescription();
		
		var tStyle = document.createTextNode(".UserListTable { border-collapse:collapse;" +
							 								 " table-layout:fixed;" +
							 								 " border-spacing:0;" +
							 								 " border-color:#ccc;" +
							 								 " width:100%;}");
		var colStyle = document.createTextNode(".UserListTable td { font-family:Arial,sans-serif;" +
    						 									  " font-size:14px;" +
    						 									  " padding:13px 0px;" +
    						 									  " border-style:solid;" +
    						 									  " border-width:0px;" +
    						 									  " overflow:hidden;" +
    						 									  " word-break:break-word;" +
    						 									  " border-color:#ccc;" +
    						 									  " color:#333;" +
    						 									  " background-color:#ccc;}");
		var hdrStyle = document.createTextNode(".UserListTable th { font-family:Arial,sans-serif;" + 
						 										  " font-size:14px;" +
						 										  " font-weight:normal;" +
						 										  " padding:13px 3px;" +
						 										  " border-style:solid;" +
						 										  " border-width:1px;" +
						 										  " overflow:hidden;" +
						 										  " word-break:break-word;" +
						 										  " border-color:#ccc;" +
						 									  	  " color:#333;" +
						 										  " background-color:#f0f0f0;}");
		var ftrStyle = document.createTextNode(".UserListTable tfoot { vertical-align:middle;" +
						 											 " font-family:Arial,sans-serif;" +
						 											 " font-size:10px;" +
						 											 " border-style:solid;" +
						 											 " border-width:0px;" +
						 											 " overflow:hidden;" +
						 											 " word-break:break-word;" +
						 											 " border-color:#ccc;" +
						 											 " color:#000;" +
						 											 " background-color:#999;}");

		s.appendChild( tStyle );								s.appendChild( colStyle );		
		s.appendChild( hdrStyle );								s.appendChild( ftrStyle );
		
		document.head.appendChild( s );

		userListContainer.ignorelist.style.display = 'none';
		
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// ++++++++++++++++++++ styleTable: updateDescription() ++++++++++++++++++++++++
		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		/*
		 * Includes a clause that informs user's how to add a reason for 
		 * blocking a user.
		 */
		function updateDescription(){
			var d = document.getElementsByClassName('singledescription')[0];
					d.innerHTML = "To remove a user from your ignore list," +
								  " un-check the box associated with their name and click " +
								  " the 'Save Changes' button." +
								  "<br><br>" +
								  "To add a user to the list, enter their " +
								  "name into the empty text box and click 'Okay'." +
								  "<br><br>" +
								  "To include a reason as to why a user has " +
								  "been placed on ignore, click the 'Add/Edit Reason' " +
								  "button and type the reason into the prompt.";
		}// end updateDescription()
		
	}// end styleTable()

}// end generateTable() {...};

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
/* |										 displayReason()									    | */
/* \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ */
/*
 * Ignored users have posts blocked by default. Locate reason stored in database and 
 * display in the container on the page.
 */
function displayReason(){
	var a, section, id, r;	
	var usersArray = document.getElementsByClassName('postbitignored postbitim');
		
	// -----------------------------------------------------------------------------
	// Loop through array of ignored posts on a page.
	// -----------------------------------------------------------------------------	
	for (var i = 0; i < usersArray.length; i++){
		a = $(usersArray[i]).children()[1].children[0].children[0].href;
		section = $(usersArray[i]).children()[2].children[0].children;
		
		// -----------------------------------------------------------------
		// Capture id as a substring. Locate reason in database.
		// -----------------------------------------------------------------
		var si = a.lastIndexOf('/');				var ei = a.indexOf('-');
		var id = a.slice( si+1, ei );
		
		il_DB.indexedDB.find( id, section );
	}// end for(i=...)
	
}// end displayReason () {...}

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */
/* |											 removeUser()	   							        | */
/* \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/ */
/*
 * Removes a user and reason from the Ignored List Databse (Alternate Flow); 
 * Fetch information from the server and reload. 
 */
function removeUser(){
	var yes = document.querySelectorAll("input[value=Yes]")[0];
	
	// -----------------------------------------------------------------------------
	// Capture the id of the user as a substring
	// -----------------------------------------------------------------------------	
	var si = location.search.lastIndexOf('=');
	var ei = location.search.length;
	var id = location.search.slice( si+1, ei );
	
	submit_deleteData( yes, id );

	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
	/* +++++++++++++++++++++++++++ removeUser() PRIVATE FUNCTIONS AND METHODS  ++++++++++++++++++++++++++ */		
	/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */	

  /*
	 * Submits data to the server (i.e. User is deleted) 
	 *
	 * @param  b        button element
	 * @param id		the id number of a user
	 */		
	function submit_deleteData(b, id){
		b.onclick = function (){   il_DB.indexedDB.remove( id );   
								   document.forms[1].submit(); 
		};// end onclick {...}
		
	}// end submit_deleteData(...)
	
}// end removeUser()