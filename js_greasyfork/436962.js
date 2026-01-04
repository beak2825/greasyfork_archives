// ==UserScript==
// @name     Script_Ancestry.com_Hint_Helper
// @description This script works with Ancestry.com’s hint merge page to properly update data.  This helps enforce genealogy best practices and saves time.
// @version  2
// @grant    none
// @license MIT
// @include https://www.ancestry.com/family-tree/tree/*
// @namespace https://greasyfork.org/users/851861
// @downloadURL https://update.greasyfork.org/scripts/436962/Script_Ancestrycom_Hint_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/436962/Script_Ancestrycom_Hint_Helper.meta.js
// ==/UserScript==

monthNames = ['', 'January','February','March','April','May','June','July','August','September','October','November','December','Sept'];

stateNames = [ 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

stateAbbrev = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];;

stateAbbrev2 = [ 'ALA.', 'ALASKA', 'ARIZ.', 'ARK.', 'CALIF.', 'COLO.', 'CONN.', 'DEL.', 'FLA.', 'GA.', 'HAWAII', 'IDAHO', 'ILL.', 'IND.', 'IOWA', 'KANS.', 'KY.', 'LA.', 'MAINE', 'MD.', 'MASS.', 'MICH.', 'MINN.', 'MISS.', 'MO.', 'MONT.', 'NEB.', 'NEV.', 'N.H.', 'N.J.', 'N.MEX.', 'N.Y.', 'N.C.', 'N.DAK.', 'OHIO', 'OKLA.', 'ORE.', 'PA.', 'R.I.', 'S.C.', 'S.DAK.', 'TENN.', 'TEX.', 'UTAH', 'VT.', 'VA.', 'WASH.', 'W.VA.', 'WIS.', 'WYO.' ];

function createInput(tag, value) {	
  return '<input id="altfield' + tag + '" type="hidden" value="' +  value + '" name="altfield' + tag + '">';
}

function addChecks( className ) {
  elements = document.getElementsByClassName (className);
	eLen = elements.length;

	for (i = 0; i < elements.length; i++) {
		elements[i].classList.add('checked');
	}
}

/*********
 * Corrects month by
 *   1) Changing "abt" to "Abt."
 *   2) Changing to DD mmm YYYY format
 *   3) Adding leading 0 to 1 digit dates (matching Family Tree Maker format)
 *   4) Adding "01 Apr" to resident dates from 1940 census
 *   5) Changing "Est" to "Abt."
 *********/
function formatDate(date, is1940census) {
 	
  if (date.length > 0) {
    if (date.substring(0,4).toLowerCase() == 'abt ') {
      date = 'Abt. ' + date.substring(4);    
    } else if (date.substring(0,4) == 'Est ') {
      date = 'Abt. ' + date.substring(4);    
    } else {
      if (date.includes('/')) {
        temp = parts[0];
      } else {
        parts = date.split(' ');  
      }
      
      if (parts.length == 3) {
        if (parts[0].length == 1) {
          parts[0] = '0' + parts[0];       
        }

        parts[1] = abbrevMonth(parts[1]);
      }

      if (parts.length == 2) {
        parts[0] = abbrevMonth(parts[0]);
      }
      
      if (parts.length == 1 && is1940census) {
      	if (parts[0] == 1935 || parts[0] == 1940) {
        	parts.unshift('Apr');
          parts.unshift('01');
        }
      }
			date = parts.join(' ');
    }
  }
  return date;
}

/*********
 * Corrects month by
 *  1) Shortening month to three letters
 *  2) Converting number to letters
 *********/
function abbrevMonth(month) {
	if (month.length != 3) {
		if (monthNames.includes(month)) {
    	month = month.substring(0,3);	  
    } else if (month > 0) {
      month = monthNames[month].substring(0,3);
    }
	}
  
	return month;
}

/*********
 * Corrects any formatting problems with the places.  This includes:
 *  1) Add USA when there is a state
 *  2) Change "United States" to USA
 *  3) Add missing counties for some states (New England in first iteration)
 *  4) Remove the word "County" when there is a city or town
 *  5) Remove "Ward #" from city
 *********/
function formatPlace(place) {
 	if (place.length > 0) {
    parts = place.split(', ');
    
    parts[parts.length -1] = parts[parts.length -1].replace('.', '');    
    
    stateAbbrev.forEach( (item, index) => {
      if ( parts[parts.length -1] == item ) {
        parts[parts.length -1] = stateNames[index];
      }
    });

    stateAbbrev2.forEach( (item, index) => {
      if ( parts[parts.length -1].toUpperCase() == item ) {
        parts[parts.length -1] = stateNames[index];
      }
    });
    
    stateNames.forEach( (item, index) => {
      if ( parts[parts.length -1] == item ) {
				parts.push('USA');
      }
    });

    if ( parts[parts.length -1] == 'United States') {
        parts[parts.length -1] = 'USA';
    }
    
    cityParts = parts[0].split(' ');
      
    if (cityParts.length > 2 && cityParts[cityParts.length - 2] == 'Ward') {
		  cityParts.pop();
      cityParts.pop();
      parts[0] = cityParts.join(' ');     
    }
    
    if (parts.length == 3 && parts[2] == 'USA') {			
      county = '';
      
    	switch ( parts[1] ) {
        case 'Connecticut':
          switch ( parts[0] ) {  
            case 'Bethel': case 'Bridgeport': case 'Brookfield': case 'Danbury': case 'Darien': case 'Easton': case 'Greenwich': case 'Monroe': case 'New Canaan': case 'New Fairfield': case 'Newtown': case 'Norwalk': case 'Redding': case 'Ridgefield': case 'Shelton': case 'Sherman': case 'Stamford': case 'Stratford': case 'Trumbull': case 'Weston': case 'Westport': case 'Wilton': county = 'Fairfield'; break; 
            case 'Avon': case 'Berlin': case 'Bloomfield': case 'Bristol': case 'Burlington': case 'Canton': case 'East Granby': case 'East Hartford': case 'East Windsor': case 'Enfield': case 'Farmington': case 'Glastonbury': case 'Granby': case 'Hartland': case 'Manchester': case 'Marlborough': case 'New Britain': case 'Newington': case 'Plainville': case 'Rocky Hill': case 'Simsbury': case 'South Windsor': case 'Southington': case 'Suffield': case 'West Hartford': case 'Wethersfield': case 'Windsor': case 'Windsor Locks': county = 'Hartford'; break; 
            case 'Barkhamsted': case 'Bethlehem': case 'Bridgewater': case 'Canaan': case 'Colebrook': case 'Cornwall': case 'Goshen': case 'Harwinton': case 'Kent': case 'Morris': case 'New Hartford': case 'New Milford': case 'Norfolk': case 'North Canaan': case 'Plymouth': case 'Roxbury': case 'Salisbury': case 'Sharon': case 'Thomaston': case 'Torrington': case 'Warren': case 'Washington': case 'Watertown': case 'Winchester': case 'Woodbury': county = 'Litchfield'; break; 
            case 'Chester': case 'Clinton': case 'Cromwell': case 'Deep River': case 'Durham': case 'East Haddam': case 'East Hampton': case 'Essex': case 'Haddam': case 'Killingworth': case 'Middlefield': case 'Middletown': case 'Old Saybrook': case 'Portland': case 'Westbrook': county = 'Middlesex'; break; 
            case 'Ansonia': case 'Beacon Falls': case 'Bethany': case 'Branford': case 'Cheshire': case 'Derby': case 'East Haven': case 'Guilford': case 'Hamden': case 'Madison': case 'Meriden': case 'Middlebury': case 'Milford': case 'Naugatuck': case 'North Branford': case 'North Haven': case 'Orange': case 'Oxford': case 'Prospect': case 'Seymour': case 'Southbury': case 'Wallingford': case 'Waterbury': case 'West Haven': case 'Wolcott': case 'Woodbridge': county = 'New Haven'; break; 
            case 'Bozrah': case 'Colchester': case 'East Lyme': case 'Franklin': case 'Griswold': case 'Groton': case 'Lebanon': case 'Ledyard': case 'Lisbon': case 'Lyme': case 'Montville': case 'North Stonington': case 'Norwich': case 'Old Lyme': case 'Preston': case 'Salem': case 'Sprague': case 'Stonington': case 'Voluntown': case 'Waterford': county = 'New London'; break; 
            case 'Andover': case 'Bolton': case 'Columbia': case 'Coventry': case 'Ellington': case 'Hebron': case 'Mansfield': case 'Somers': case 'Stafford': case 'Union': case 'Vernon': case 'Willington': county = 'Tolland'; break; 
            case 'Ashford': case 'Brooklyn': case 'Canterbury': case 'Chaplin': case 'Eastford': case 'Hampton': case 'Killingly': case 'Plainfield': case 'Pomfret': case 'Putnam': case 'Scotland': case 'Sterling': case 'Thompson': case 'Woodstock': county = 'Windham'; break; 
          }
          break;
        case 'Maine':
          switch ( parts[0] ) {  
            case 'Durham': case 'Greene': case 'Leeds': case 'Lisbon': case 'Livermore': case 'Livermore Falls': case 'Mechanic Falls': case 'Minot': case 'Poland': case 'Sabattus': case 'Turner': case 'Wales': county = 'Androscoggin'; break; 
            case 'Allagash': case 'Amity': case 'Ashland': case 'Blaine': case 'Bridgewater': case 'Castle Hill': case 'Caswell': case 'Chapman': case 'Crystal': case 'Dyer Brook': case 'Eagle Lake': case 'Easton': case 'Fort Fairfield': case 'Fort Kent': case 'Frenchville': case 'Grand Isle': case 'Hamlin': case 'Hammond': case 'Haynesville': case 'Hersey': case 'Hodgdon': case 'Houlton': case 'Island Falls': case 'Limestone': case 'Linneus': case 'Littleton': case 'Ludlow': case 'Madawaska': case 'Mapleton': case 'Mars Hill': case 'Masardis': case 'Merrill': case 'Monticello': case 'New Canada': case 'New Limerick': case 'New Sweden': case 'Oakfield': case 'Orient': case 'Perham': case 'Portage Lake': case 'Sherman': case 'Smyrna': case 'St. Agatha': case 'St. Francis': case 'Stockholm': case 'Van Buren': case 'Wade': case 'Wallagrass': case 'Washburn': case 'Westfield': case 'Westmanland': case 'Weston': case 'Woodland': county = 'Aroostook'; break; 
            case 'Durham': case 'Greene': case 'Leeds': case 'Lewiston': case 'Lisbon': case 'Livermore': case 'Livermore Falls': case 'Mechanic Falls': case 'Minot': case 'Poland': case 'Sabattus': case 'Turner': case 'Wales': county = 'Androscoggin'; break; 
            case 'Allagash': case 'Amity': case 'Ashland': case 'Blaine': case 'Bridgewater': case 'Caribou': case 'Castle Hill': case 'Caswell': case 'Chapman': case 'Crystal': case 'Dyer Brook': case 'Eagle Lake': case 'Easton': case 'Fort Fairfield': case 'Fort Kent': case 'Frenchville': case 'Grand Isle': case 'Hamlin': case 'Hammond': case 'Haynesville': case 'Hersey': case 'Hodgdon': case 'Houlton': case 'Island Falls': case 'Limestone': case 'Linneus': case 'Littleton': case 'Ludlow': case 'Madawaska': case 'Mapleton': case 'Mars Hill': case 'Masardis': case 'Merrill': case 'Monticello': case 'New Canada': case 'New Limerick': case 'New Sweden': case 'Oakfield': case 'Orient': case 'Perham': case 'Portage Lake': case 'Presque Isle': case 'Sherman': case 'Smyrna': case 'St. Agatha': case 'St. Francis': case 'Stockholm': case 'Van Buren': case 'Wade': case 'Wallagrass': case 'Washburn': case 'Westfield': case 'Westmanland': case 'Weston': case 'Woodland': county = 'Aroostook'; break; 
            case 'Baldwin': case 'Bridgton': case 'Brunswick': case 'Cape Elizabeth': case 'Casco': case 'Chebeague Island': case 'Falmouth': case 'Freeport': case 'Frye Island': case 'Gorham': case 'Gray': case 'Harpswell': case 'Harrison': case 'Long Island': case 'Naples': case 'New Gloucester': case 'North Yarmouth': case 'Portland': case 'Pownal': case 'Raymond': case 'Scarborough': case 'Sebago': case 'South Portland': case 'Standish': case 'Westbrook': case 'Windham': case 'Yarmouth': county = 'Cumberland'; break; 
            case 'Avon': case 'Carrabassett Valley': case 'Carthage': case 'Chesterville': case 'Eustis': case 'Farmington': case 'Industry': case 'Jay': case 'Kingfield': case 'New Sharon': case 'New Vineyard': case 'Phillips': case 'Rangeley': case 'Strong': case 'Temple': case 'Weld': case 'Wilton': county = 'Franklin'; break; 
            case 'Amherst': case 'Aurora': case 'Bar Harbor': case 'Blue Hill': case 'Brooklin': case 'Brooksville': case 'Bucksport': case 'Castine': case 'Cranberry Isles': case 'Dedham': case 'Deer Isle': case 'Eastbrook': case 'Ellsworth': case 'Frenchboro': case 'Gouldsboro': case 'Great Pond': case 'Lamoine': case 'Mariaville': case 'Mount Desert': case 'Orland': case 'Osborn': case 'Otis': case 'Sedgwick': case 'Sorrento': case 'Southwest Harbor': case 'Stonington': case 'Sullivan': case 'Surry': case "Swan's Island": case 'Tremont': case 'Trenton': case 'Verona Island': case 'Waltham': case 'Winter Harbor': county = 'Hancock'; break; 
            case 'Albion': case 'Augusta': case 'Belgrade': case 'Benton': case 'Chelsea': case 'China': case 'Clinton': case 'Farmingdale': case 'Fayette': case 'Gardiner': case 'Hallowell': case 'Litchfield': case 'Manchester': case 'Monmouth': case 'Mount Vernon': case 'Oakland': case 'Pittston': case 'Randolph': case 'Readfield': case 'Rome': case 'Sidney': case 'Vassalboro': case 'Vienna': case 'Waterville': case 'Wayne': case 'West Gardiner': case 'Windsor': case 'Winslow': case 'Winthrop': county = 'Kennebec'; break; 
            case 'Appleton': case 'Camden': case 'Cushing': case 'Friendship': case 'Hope': case 'Isle au Haut': case 'North Haven': case 'Owls Head': case 'Rockland': case 'Rockport': case 'South Thomaston': case 'St. George': case 'Thomaston': case 'Union': case 'Vinalhaven': case 'Warren': county = 'Knox'; break; 
            case 'Alna': case 'Boothbay': case 'Boothbay Harbor': case 'Bremen': case 'Bristol': case 'Damariscotta': case 'Dresden': case 'Edgecomb': case 'Jefferson': case 'Newcastle': case 'Nobleboro': case 'Somerville': case 'South Bristol': case 'Southport': case 'Waldoboro': case 'Westport Island': case 'Whitefield': case 'Wiscasset': county = 'Lincoln'; break; 
            case 'Andover': case 'Bethel': case 'Brownfield': case 'Buckfield': case 'Byron': case 'Canton': case 'Denmark': case 'Dixfield': case 'Fryeburg': case 'Gilead': case 'Greenwood': case 'Hanover': case 'Hartford': case 'Hebron': case 'Hiram': case 'Lovell': case 'Mexico': case 'Newry': case 'Norway': case 'Otisfield': case 'Paris': case 'Peru': case 'Porter': case 'Roxbury': case 'Rumford': case 'Stoneham': case 'Stow': case 'Sumner': case 'Sweden': case 'Upton': case 'Waterford': case 'West Paris': case 'Woodstock': county = 'Oxford'; break; 
            case 'Alton': case 'Bangor': case 'Bradford': case 'Bradley': case 'Brewer': case 'Burlington': case 'Carmel': case 'Charleston': case 'Chester': case 'Clifton': case 'Corinna': case 'Corinth': case 'Dexter': case 'Dixmont': case 'East Millinocket': case 'Eddington': case 'Edinburg': case 'Enfield': case 'Etna': case 'Exeter': case 'Garland': case 'Glenburn': case 'Greenbush': case 'Hampden': case 'Hermon': case 'Holden': case 'Howland': case 'Hudson': case 'Kenduskeag': case 'Lagrange': case 'Lakeville': case 'Lee': case 'Levant': case 'Lowell': case 'Mattawamkeag': case 'Maxfield': case 'Medway': case 'Milford': case 'Millinocket': case 'Mount Chase': case 'Newburgh': case 'Newport': case 'Old Town': case 'Orono': case 'Orrington': case 'Passadumkeag': case 'Patten': case 'Plymouth': case 'Springfield': case 'Stacyville': case 'Stetson': case 'Veazie': case 'Winn': case 'Woodville': county = 'Penobscot'; break; 
            case 'Abbot': case 'Beaver Cove': case 'Bowerbank': case 'Brownville': case 'Dover-Foxcroft': case 'Greenville': case 'Guilford': case 'Medford': case 'Milo': case 'Monson': case 'Parkman': case 'Sangerville': case 'Sebec': case 'Shirley': case 'Wellington': case 'Willimantic': county = 'Piscataquis'; break; 
            case 'Arrowsic': case 'Bath': case 'Bowdoin': case 'Bowdoinham': case 'Georgetown': case 'Phippsburg': case 'Richmond': case 'Topsham': case 'West Bath': case 'Woolwich': county = 'Sagadahoc'; break; 
            case 'Anson': case 'Athens': case 'Bingham': case 'Cambridge': case 'Canaan': case 'Caratunk': case 'Cornville': case 'Detroit': case 'Embden': case 'Fairfield': case 'Harmony': case 'Hartland': case 'Jackman': case 'Madison': case 'Mercer': case 'Moose River': case 'Moscow': case 'New Portland': case 'Norridgewock': case 'Palmyra': case 'Pittsfield': case 'Ripley': case 'Skowhegan': case 'Smithfield': case 'Solon': case 'St. Albans': case 'Starks': county = 'Somerset'; break; 
            case 'Belfast': case 'Belmont': case 'Brooks': case 'Burnham': case 'Frankfort': case 'Freedom': case 'Islesboro': case 'Jackson': case 'Liberty': case 'Lincolnville': case 'Monroe': case 'Montville': case 'Morrill': case 'Northport': case 'Palermo': case 'Prospect': case 'Searsmont': case 'Searsport': case 'Stockton Springs': case 'Swanville': case 'Thorndike': case 'Troy': case 'Unity': case 'Winterport': county = 'Waldo'; break; 
            case 'Addison': case 'Alexander': case 'Baileyville': case 'Beals': case 'Beddington': case 'Calais': case 'Charlotte': case 'Cherryfield': case 'Columbia': case 'Columbia Falls': case 'Cooper': case 'Crawford': case 'Cutler': case 'Danforth': case 'Deblois': case 'Dennysville': case 'East Machias': case 'Harrington': case 'Jonesboro': case 'Jonesport': case 'Lubec': case 'Machias': case 'Machiasport': case 'Marshfield': case 'Meddybemps': case 'Milbridge': case 'Northfield': case 'Pembroke': case 'Perry': case 'Princeton': case 'Robbinston': case 'Roque Bluffs': case 'Steuben': case 'Talmadge': case 'Topsfield': case 'Vanceboro': case 'Waite': case 'Wesley': case 'Whiting': case 'Whitneyville': county = 'Washington'; break; 
            case 'Acton': case 'Alfred': case 'Arundel': case 'Berwick': case 'Biddeford': case 'Buxton': case 'Cornish': case 'Dayton': case 'Eliot': case 'Hollis': case 'Kennebunk': case 'Kennebunkport': case 'Kittery': case 'Lebanon': case 'Limerick': case 'Limington': case 'Lyman': case 'Newfield': case 'North Berwick': case 'Ogunquit': case 'Old Orchard Beach': case 'Parsonsfield': case 'Saco': case 'Sanford': case 'Shapleigh': case 'South Berwick': case 'Waterboro': case 'Wells': county = 'York'; break;               
          }
          break;
        case 'Massachusetts':
          switch ( parts[0] ) {  
            case 'Bourne': case 'Brewster': case 'Chatham': case 'Dennis': case 'Eastham': case 'Falmouth': case 'Harwich': case 'Mashpee': case 'Orleans': case 'Provincetown': case 'Sandwich': case 'Truro': case 'Wellfleet': case 'Yarmouth': county = 'Barnstable'; break; 
            case 'Adams': case 'Alford': case 'Becket': case 'Cheshire': case 'Clarksburg': case 'Dalton': case 'Egremont': case 'Florida': case 'Great Barrington': case 'Hancock': case 'Hinsdale': case 'Lanesborough': case 'Lee': case 'Lenox': case 'Monterey': case 'Mount Washington': case 'New Ashford': case 'New Marlborough': case 'North Adams': case 'Otis': case 'Peru': case 'Pittsfield': case 'Richmond': case 'Sandisfield': case 'Savoy': case 'Sheffield': case 'Stockbridge': case 'Tyringham': case 'Washington': case 'West Stockbridge': case 'Williamstown': case 'Windsor': county = 'Berkshire'; break; 
            case 'Acushnet': case 'Attleboro': case 'Berkley': case 'Dartmouth': case 'Dighton': case 'Easton': case 'Fairhaven': case 'Fall River': case 'Freetown': case 'Mansfield': case 'New Bedford': case 'North Attleborough': case 'Norton': case 'Raynham': case 'Rehoboth': case 'Seekonk': case 'Somerset': case 'Swansea': case 'Taunton': case 'Westport': county = 'Bristol'; break; 
            case 'Aquinnah': case 'Chilmark': case 'Edgartown': case 'Gosnold': case 'Oak Bluffs': case 'Tisbury': case 'West Tisbury': county = 'Dukes'; break; 
            case 'Amesbury': case 'Andover': case 'Beverly': case 'Boxford': case 'Danvers': case 'Georgetown': case 'Gloucester': case 'Groveland': case 'Hamilton': case 'Haverhill': case 'Ipswich': case 'Lawrence': case 'Lynn': case 'Lynnfield': case 'Manchester-by-the-Sea': case 'Marblehead': case 'Merrimac': case 'Methuen': case 'Middleton': case 'Nahant': case 'Newbury': case 'Newburyport': case 'North Andover': case 'Peabody': case 'Rockport': case 'Rowley': case 'Salem': case 'Salisbury': case 'Saugus': case 'Swampscott': case 'Topsfield': case 'Wenham': case 'West Newbury': county = 'Essex'; break; 
            case 'Ashfield': case 'Bernardston': case 'Buckland': case 'Charlemont': case 'Colrain': case 'Conway': case 'Deerfield': case 'Erving': case 'Gill': case 'Greenfield': case 'Hawley': case 'Heath': case 'Leverett': case 'Leyden': case 'Monroe': case 'Montague': case 'New Salem': case 'Northfield': case 'Orange': case 'Rowe': case 'Shelburne': case 'Shutesbury': case 'Sunderland': case 'Warwick': case 'Wendell': case 'Whately': county = 'Franklin'; break; 
            case 'Agawam': case 'Blandford': case 'Brimfield': case 'Chester': case 'Chicopee': case 'East Longmeadow': case 'Granville': case 'Holland': case 'Holyoke': case 'Longmeadow': case 'Ludlow': case 'Monson': case 'Montgomery': case 'Palmer': case 'Russell': case 'Southwick': case 'Springfield': case 'Tolland': case 'Wales': case 'West Springfield': case 'Westfield': case 'Wilbraham': county = 'Hampden'; break; 
            case 'Amherst': case 'Belchertown': case 'Chesterfield': case 'Cummington': case 'Easthampton': case 'Goshen': case 'Granby': case 'Hadley': case 'Hatfield': case 'Huntington': case 'Middlefield': case 'Northampton': case 'Pelham': case 'Plainfield': case 'South Hadley': case 'Southampton': case 'Ware': case 'Westhampton': case 'Williamsburg': case 'Worthington': county = 'Hampshire'; break; 
            case 'Acton': case 'Arlington': case 'Ashby': case 'Ashland': case 'Ayer': case 'Bedford': case 'Belmont': case 'Billerica': case 'Boxborough': case 'Burlington': case 'Cambridge': case 'Carlisle': case 'Chelmsford': case 'Concord': case 'Dracut': case 'Dunstable': case 'Everett': case 'Framingham': case 'Groton': case 'Holliston': case 'Hopkinton': case 'Hudson': case 'Lexington': case 'Lincoln': case 'Littleton': case 'Lowell': case 'Malden': case 'Marlborough': case 'Maynard': case 'Medford': case 'Melrose': case 'Natick': case 'Newton': case 'North Reading': case 'Pepperell': case 'Reading': case 'Sherborn': case 'Shirley': case 'Somerville': case 'Stoneham': case 'Stow': case 'Sudbury': case 'Tewksbury': case 'Townsend': case 'Tyngsborough': case 'Wakefield': case 'Waltham': case 'Watertown': case 'Wayland': case 'Westford': case 'Weston': case 'Wilmington': case 'Winchester': case 'Woburn': county = 'Middlesex'; break; 
            case 'Nantucket': county = 'Nantucket'; break; 
            case 'Avon': case 'Bellingham': case 'Braintree': case 'Brookline': case 'Canton': case 'Cohasset': case 'Dedham': case 'Dover': case 'Foxborough': case 'Franklin': case 'Holbrook': case 'Medfield': case 'Medway': case 'Millis': case 'Milton': case 'Needham': case 'Norwood': case 'Plainville': case 'Quincy': case 'Randolph': case 'Sharon': case 'Stoughton': case 'Walpole': case 'Wellesley': case 'Westwood': case 'Weymouth': case 'Wrentham': county = 'Norfolk'; break; 
            case 'Abington': case 'Bridgewater': case 'Brockton': case 'Carver': case 'Duxbury': case 'East Bridgewater': case 'Halifax': case 'Hanover': case 'Hanson': case 'Hingham': case 'Hull': case 'Kingston': case 'Lakeville': case 'Marion': case 'Marshfield': case 'Mattapoisett': case 'Middleborough': case 'Norwell': case 'Pembroke': case 'Plympton': case 'Rochester': case 'Rockland': case 'Scituate': case 'Wareham': case 'West Bridgewater': case 'Whitman': county = 'Plymouth'; break; 
            case 'Boston': case 'Chelsea': case 'Revere': case 'Winthrop': county = 'Suffolk'; break; 
            case 'Ashburnham': case 'Athol': case 'Auburn': case 'Barre': case 'Berlin': case 'Blackstone': case 'Bolton': case 'Boylston': case 'Brookfield': case 'Charlton': case 'Clinton': case 'Douglas': case 'Dudley': case 'East Brookfield': case 'Fitchburg': case 'Gardner': case 'Grafton': case 'Hardwick': case 'Harvard': case 'Holden': case 'Hopedale': case 'Hubbardston': case 'Lancaster': case 'Leicester': case 'Leominster': case 'Lunenburg': case 'Mendon': case 'Milford': case 'Millbury': case 'Millville': case 'New Braintree': case 'North Brookfield': case 'Northborough': case 'Northbridge': case 'Oakham': case 'Oxford': case 'Paxton': case 'Petersham': case 'Phillipston': case 'Princeton': case 'Royalston': case 'Rutland': case 'Shrewsbury': case 'Southborough': case 'Southbridge': case 'Spencer': case 'Sterling': case 'Sturbridge': case 'Sutton': case 'Templeton': case 'Upton': case 'Uxbridge': case 'Warren': case 'Webster': case 'West Boylston': case 'West Brookfield': case 'Westborough': case 'Westminster': case 'Winchendon': county = 'Worcester'; break; 
          }
          break;

        case 'New Hampshire':
          switch ( parts[0] ) {  
            case 'Alton': case 'Barnstead': case 'Belmont': case 'Center Harbor': case 'Gilford': case 'Gilmanton': case 'Laconia': case 'Meredith': case 'New Hampton': case 'Sanbornton': case 'Tilton': county = 'Belknap'; break; 
            case 'Albany': case 'Bartlett': case 'Brookfield': case 'Chatham': case 'Conway': case 'Eaton': case 'Effingham': case 'Freedom': case "Hart's Location": case 'Jackson': case 'Madison': case 'Moultonborough': case 'Ossipee': case 'Sandwich': case 'Tamworth': case 'Tuftonboro': case 'Wakefield': case 'Wolfeboro': county = 'Carroll'; break; 
            case 'Alstead': case 'Chesterfield': case 'Dublin': case 'Fitzwilliam': case 'Gilsum': case 'Harrisville': case 'Hinsdale': case 'Jaffrey': case 'Keene': case 'Marlborough': case 'Marlow': case 'Nelson': case 'Richmond': case 'Rindge': case 'Roxbury': case 'Stoddard': case 'Sullivan': case 'Surry': case 'Swanzey': case 'Troy': case 'Walpole': case 'Westmoreland': case 'Winchester': county = 'Cheshire'; break; 
            case 'Berlin': case 'Clarksville': case 'Colebrook': case 'Columbia': case 'Dalton': case 'Dummer': case 'Errol': case 'Gorham': case 'Jefferson': case 'Lancaster': case 'Milan': case 'Northumberland': case 'Pittsburg': case 'Randolph': case 'Shelburne': case 'Stark': case 'Stewartstown': case 'Whitefield': county = 'Coos'; break; 
            case 'Alexandria': case 'Ashland': case 'Bath': case 'Benton': case 'Bethlehem': case 'Bridgewater': case 'Bristol': case 'Campton': case 'Canaan': case 'Dorchester': case 'Easton': case 'Ellsworth': case 'Enfield': case 'Franconia': case 'Groton': case 'Hanover': case 'Haverhill': case 'Hebron': case 'Holderness': case 'Landaff': case 'Lebanon': case 'Lincoln': case 'Lisbon': case 'Littleton': case 'Lyman': case 'Lyme': case 'Monroe': case 'Orange': case 'Orford': case 'Piermont': case 'Plymouth': case 'Rumney': case 'Sugar Hill': case 'Thornton': case 'Warren': case 'Waterville Valley': case 'Wentworth': case 'Woodstock': county = 'Grafton'; break; 
            case 'Amherst': case 'Antrim': case 'Bedford': case 'Bennington': case 'Brookline': case 'Deering': case 'Francestown': case 'Goffstown': case 'Greenfield': case 'Greenville': case 'Hancock': case 'Hollis': case 'Hudson': case 'Litchfield': case 'Lyndeborough': case 'Manchester': case 'Mason': case 'Milford': case 'Mont Vernon': case 'Nashua': case 'New Boston': case 'New Ipswich': case 'Pelham': case 'Peterborough': case 'Sharon': case 'Temple': case 'Weare': case 'Wilton': case 'Windsor': county = 'Hillsborough'; break; 
            case 'Allenstown': case 'Andover': case 'Boscawen': case 'Bow': case 'Bradford': case 'Canterbury': case 'Chichester': case 'Concord': case 'Danbury': case 'Dunbarton': case 'Epsom': case 'Franklin': case 'Henniker': case 'Hill': case 'Hooksett': case 'Hopkinton': case 'Loudon': case 'New London': case 'Newbury': case 'Northfield': case 'Pembroke': case 'Pittsfield': case 'Salisbury': case 'Sutton': case 'Warner': case 'Webster': case 'Wilmot': county = 'Merrimack'; break; 
            case 'Atkinson': case 'Auburn': case 'Brentwood': case 'Candia': case 'Chester': case 'Danville': case 'Deerfield': case 'Derry': case 'East Kingston': case 'Epping': case 'Exeter': case 'Fremont': case 'Greenland': case 'Hampstead': case 'Hampton': case 'Hampton Falls': case 'Kensington': case 'Kingston': case 'Londonderry': case 'New Castle': case 'Newfields': case 'Newington': case 'Newmarket': case 'Newton': case 'North Hampton': case 'Northwood': case 'Nottingham': case 'Plaistow': case 'Portsmouth': case 'Raymond': case 'Rye': case 'Salem': case 'Sandown': case 'Seabrook': case 'South Hampton': case 'Stratham': case 'Windham': county = 'Rockingham'; break; 
            case 'Barrington': case 'Dover': case 'Durham': case 'Farmington': case 'Lee': case 'Madbury': case 'Middleton': case 'Milton': case 'New Durham': case 'Rochester': case 'Rollinsford': case 'Somersworth': county = 'Strafford'; break; 
            case 'Acworth': case 'Charlestown': case 'Claremont': case 'Cornish': case 'Croydon': case 'Goshen': case 'Grantham': case 'Langdon': case 'Lempster': case 'Newport': case 'Plainfield': case 'Springfield': case 'Sunapee': case 'Unity': case 'Washington': case 'Springfield': case 'Sunapee': case 'Unity': case 'Washington': county = 'Sullivan'; break; 
          }
          break;

        case 'Oregon':
          switch ( parts[0] ) {  
            case 'Baker City ': case 'Haines': case 'Halfway': case 'Huntington': case 'Richland': case 'Sumpter': case 'Unity': county = 'Baker'; break; 
            case 'Adair Village': case 'Corvallis ': case 'Monroe': case 'Philomath': county = 'Benton'; break; 
            case 'Barlow': case 'Canby': case 'Estacada': case 'Gladstone': case 'Happy Valley': case 'Johnson City': case 'Molalla': case 'Oregon City ': case 'Sandy': case 'West Linn': county = 'Clackamas'; break; 
            case 'Astoria ': case 'Cannon Beach': case 'Gearhart': case 'Seaside': case 'Warrenton': county = 'Clatsop'; break; 
            case 'Clatskanie': case 'Columbia City': case 'Prescott': case 'Rainier': case 'Scappoose': case 'St. Helens ': case 'Vernonia': county = 'Columbia'; break; 
            case 'Bandon': case 'Coos Bay': case 'Coquille ': case 'Lakeside': case 'Myrtle Point': case 'North Bend': case 'Powers': county = 'Coos'; break; 
            case 'Prineville ': county = 'Crook'; break; 
            case 'Brookings': case 'Gold Beach ': case 'Port Orford': county = 'Curry'; break; 
            case 'Bend ': case 'La Pine': case 'Redmond': case 'Sisters': county = 'Deschutes'; break; 
            case 'Canyonville': case 'Drain': case 'Elkton': case 'Glendale': case 'Myrtle Creek': case 'Oakland': case 'Reedsport': case 'Riddle': case 'Roseburg ': case 'Sutherlin': case 'Winston': case 'Yoncalla': county = 'Douglas'; break; 
            case 'Arlington': case 'Condon ': case 'Lonerock': county = 'Gilliam'; break; 
            case 'Canyon City ': case 'Dayville': case 'Granite': case 'John Day': case 'Long Creek': case 'Monument': case 'Mount Vernon': case 'Prairie City': case 'Seneca': county = 'Grant'; break; 
            case 'Burns ': case 'Hines': county = 'Harney'; break; 
            case 'Cascade Locks': county = 'Hood River'; break; 
            case 'Ashland': case 'Butte Falls': case 'Central Point': case 'Eagle Point': case 'Gold Hill': case 'Jacksonville': case 'Medford ': case 'Phoenix': case 'Rogue River': case 'Shady Cove': case 'Talent': county = 'Jackson'; break; 
            case 'Culver': case 'Madras ': case 'Metolius': county = 'Jefferson'; break; 
            case 'Cave Junction': case 'Grants Pass ': county = 'Josephine'; break; 
            case 'Bonanza': case 'Chiloquin': case 'Klamath Falls ': case 'Malin': case 'Merrill': county = 'Klamath'; break; 
            case 'Lakeview ': case 'Paisley': county = 'Lake'; break; 
            case 'Coburg': case 'Cottage Grove': case 'Creswell': case 'Dunes City': case 'Eugene ': case 'Florence': case 'Junction City': case 'Lowell': case 'Oakridge': case 'Springfield': case 'Veneta': case 'Westfir': county = 'Lane'; break; 
            case 'Depoe Bay': case 'Lincoln City': case 'Newport ': case 'Siletz': case 'Toledo': case 'Waldport': case 'Yachats': county = 'Lincoln'; break; 
            case 'Brownsville': case 'Halsey': case 'Harrisburg': case 'Lebanon': case 'Lyons': case 'Millersburg': case 'Scio': case 'Sodaville': case 'Sweet Home': case 'Tangent': county = 'Linn'; break; 
            case 'Adrian': case 'Jordan Valley': case 'Nyssa': case 'Ontario': case 'Vale ': county = 'Malheur'; break; 
            case 'Aumsville': case 'Aurora': case 'Detroit': case 'Donald': case 'Gervais': case 'Hubbard': case 'Keizer': case 'Mt. Angel': case 'Scotts Mills': case 'Silverton': case 'St. Paul': case 'Stayton': case 'Sublimity': case 'Turner': case 'Woodburn': county = 'Marion'; break; 
            case 'Boardman': case 'Heppner ': case 'Ione': case 'Irrigon': case 'Lexington': county = 'Morrow'; break; 
            case 'Fairview': case 'Gresham': case 'Maywood Park': case 'Troutdale': case 'Wood Village': county = 'Multnomah'; break; 
            case 'Dallas ': case 'Falls City': case 'Independence': case 'Monmouth': county = 'Polk'; break; 
            case 'Grass Valley': case 'Moro ': case 'Rufus': county = 'Sherman'; break; 
            case 'Bay City': case 'Garibaldi': case 'Manzanita': case 'Nehalem': case 'Rockaway Beach': county = 'Tillamook'; break; 
            case 'Adams': case 'Athena': case 'Echo': case 'Helix': case 'Hermiston': case 'Milton-Freewater': case 'Pendleton ': case 'Pilot Rock': case 'Stanfield': case 'Ukiah': case 'Weston': county = 'Umatilla'; break; 
            case 'Cove': case 'Elgin': case 'Imbler': case 'Island City': case 'La Grande ': case 'North Powder': case 'Summerville': county = 'Union'; break; 
            case 'Enterprise ': case 'Joseph': case 'Lostine': county = 'Wallowa'; break; 
            case 'Antelope': case 'Dufur': case 'Maupin': case 'Mosier': case 'Shaniko': case 'The Dalles': case 'Tygh Valley': county = 'Wasco'; break; 
            case 'Banks': case 'Beaverton': case 'Cornelius': case 'Durham': case 'Forest Grove': case 'Hillsboro ': case 'King City': case 'North Plains': case 'Sherwood': case 'Tigard': county = 'Washington'; break; 
            case 'Fossil ': case 'Mitchell': case 'Spray': county = 'Wheeler'; break; 
            case 'Amity': case 'Carlton': case 'Dayton': case 'Dundee': case 'Lafayette': case 'McMinnville ': case 'Newberg': case 'Sheridan': county = 'Yamhill'; break; 
          }
          break;
              
        case 'Rhode Island':
          switch ( parts[0] ) {  
            case 'Barrington': case 'Warren': county = 'Bristol'; break; 
            case 'Coventry': case 'East Greenwich': case 'Warwick': case 'West Greenwich': case 'West Warwick': county = 'Kent'; break; 
            case 'Jamestown': case 'Little Compton': case 'Middletown': case 'Portsmouth': case 'Tiverton': county = 'Newport'; break; 
            case 'Burrillville': case 'Central Falls': case 'Cranston': case 'Cumberland': case 'East Providence': case 'Foster': case 'Glocester': case 'Johnston': case 'Lincoln': case 'North Providence': case 'North Smithfield': case 'Pawtucket': case 'Scituate': case 'Smithfield': case 'Woonsocket': county = 'Providence'; break; 
            case 'Charlestown': case 'Exeter': case 'Hopkinton': case 'Narragansett': case 'New Shoreham': case 'North Kingstown': case 'Richmond': case 'South Kingstown': case 'Westerly': county = 'Washington'; break; 
          }
          break;   
        case 'Vermont':
          switch ( parts[0] ) {  
            case 'Bridport': case 'Bristol': case 'Cornwall': case 'Ferrisburgh': case 'Goshen': case 'Granville': case 'Hancock': case 'Leicester': case 'Lincoln': case 'Middlebury': case 'Monkton': case 'New Haven': case 'Orwell': case 'Panton': case 'Ripton': case 'Salisbury': case 'Shoreham': case 'Starksboro': case 'Waltham': case 'Weybridge': case 'Whiting': county = 'Addison'; break; 
            case 'Arlington': case 'Dorset': case 'Glastenbury': case 'Landgrove': case 'Manchester': case 'Peru': case 'Pownal': case 'Readsboro': case 'Rupert': case 'Sandgate': case 'Searsburg': case 'Shaftsbury': case 'Stamford': case 'Sunderland': case 'Winhall': case 'Woodford': county = 'Bennington'; break; 
            case 'Barnet': case 'Burke': case 'Danville': case 'Groton': case 'Hardwick': case 'Kirby': case 'Lyndon': case 'Newark': case 'Peacham': case 'Ryegate': case 'Sheffield': case 'St. Johnsbury': case 'Stannard': case 'Sutton': case 'Walden': case 'Waterford': case 'Wheelock': county = 'Caledonia'; break; 
            case 'Bolton': case 'Buels Gore': case 'Charlotte': case 'Colchester': case 'Hinesburg': case 'Huntington': case 'Jericho': case 'Milton': case 'Richmond': case 'Shelburne': case 'St. George': case 'Underhill': case 'Westford': case 'Williston': county = 'Chittenden'; break; 
            case 'Averill': case 'Averys Gore': case 'Bloomfield': case 'Brighton': case 'Brunswick': case 'Canaan': case 'Concord': case 'East Haven': case 'Ferdinand': case 'Granby': case 'Guildhall': case 'Lemington': case 'Lewis': case 'Lunenburg': case 'Maidstone': case 'Norton': case 'Victory': case "Warner's Grant": case "Warren's Gore": county = 'Essex'; break; 
            case 'Bakersfield': case 'Berkshire': case 'Enosburgh': case 'Fairfax': case 'Fairfield': case 'Fletcher': case 'Georgia': case 'Highgate': case 'Montgomery': case 'Richford': case 'Sheldon': case 'St. Albans': case 'Swanton': county = 'Franklin'; break; 
            case 'Alburgh': case 'Isle La Motte': case 'North Hero': case 'South Hero': county = 'Grand Isle'; break; 
            case 'Belvidere': case 'Cambridge': case 'Eden': case 'Elmore': case 'Hyde Park': case 'Johnson': case 'Morristown': case 'Stowe': case 'Waterville': case 'Wolcott': county = 'Lamoille'; break; 
            case 'Bradford': case 'Braintree': case 'Brookfield': case 'Chelsea': case 'Corinth': case 'Fairlee': case 'Newbury': case 'Randolph': case 'Strafford': case 'Thetford': case 'Topsham': case 'Tunbridge': case 'Vershire': case 'Washington': case 'West Fairlee': case 'Williamstown': county = 'Orange'; break; 
            case 'Albany': case 'Barton': case 'Brownington': case 'Charleston': case 'Coventry': case 'Craftsbury': case 'Derby': case 'Glover': case 'Greensboro': case 'Holland': case 'Irasburg': case 'Jay': case 'Lowell': case 'Morgan': case 'Newport': case 'Troy': case 'Westfield': case 'Westmore': county = 'Orleans'; break; 
            case 'Benson': case 'Brandon': case 'Castleton': case 'Clarendon': case 'Danby': case 'Fair Haven': case 'Hubbardton': case 'Ira': case 'Killington': case 'Mendon': case 'Middletown Springs': case 'Mount Holly': case 'Mount Tabor': case 'Pawlet': case 'Pittsfield': case 'Pittsford': case 'Poultney': case 'Proctor': case 'Shrewsbury': case 'Sudbury': case 'Tinmouth': case 'Wallingford': case 'Wells': case 'West Haven': case 'West Rutland': county = 'Rutland'; break; 
            case 'Barre': case 'Berlin': case 'Cabot': case 'Calais': case 'Duxbury': case 'East Montpelier': case 'Fayston': case 'Marshfield': case 'Middlesex': case 'Moretown': case 'Northfield': case 'Plainfield': case 'Roxbury': case 'Waitsfield': case 'Warren': case 'Waterbury': case 'Woodbury': case 'Worcester': county = 'Washington'; break; 
            case 'Athens': case 'Brattleboro': case 'Brookline': case 'Dover': case 'Dummerston': case 'Grafton': case 'Guilford': case 'Halifax': case 'Jamaica': case 'Londonderry': case 'Marlboro': case 'Newfane': case 'Putney': case 'Rockingham': case 'Somerset': case 'Stratton': case 'Townshend': case 'Vernon': case 'Wardsboro': case 'Westminster': case 'Whitingham': case 'Wilmington': county = 'Windham'; break; 
            case 'Andover': case 'Baltimore': case 'Barnard': case 'Bethel': case 'Bridgewater': case 'Cavendish': case 'Chester': case 'Hartford': case 'Hartland': case 'Ludlow': case 'Norwich': case 'Plymouth': case 'Pomfret': case 'Reading': case 'Rochester': case 'Royalton': case 'Sharon': case 'Springfield': case 'Stockbridge': case 'Weathersfield': case 'West Windsor': case 'Weston': case 'Woodstock': county = 'Windsor'; break; 
          }
          break;
      }
      
      if (county.length > 0) {
        parts.splice(1, 0, county);
      }
    }
    
   	if (parts.length == 4) {
    	if (parts[1].endsWith("County")) {
        parts[1] = parts[1].substring(0, parts[1].length - 7); 
      }
    }
    
    if (parts[parts.length - 1] == 'United States of America') {
    	parts[parts.length - 1] = 'USA';
    }
    
		place = parts.join(', ');
  }
  return place;
}

function formatCounty(place) {
	parts = place.split(', ');
  if (parts.length == 3) {
  	parts[0] = parts[0] + ' County';
  }
  
	place = parts.join(', ');
  return place;  
}

/***********************
 * Some databases require cleanup later.  Identify databases 
 ***********************/
var is1940census = false;
var isCaliforniaDeathIndex = false;
var isMinnesotaDeathIndex = false;
var addCounty = false;
var isUSVeteransGravesites = false;
var is1910census = false;

elements = document.getElementsByClassName ('subtitle recHeader textlrg coloralt4 bold');

if (elements[0].innerHTML == 'in the 1940 United States Federal Census') {
	is1940census = true; 
} else if (elements[0].innerHTML == "in the U.S., Veterans' Gravesites, ca.1775-2019" ) {
	isUSVeteransGravesites = true;
} else if (elements[0].innerHTML == "in the California, U.S., Death Index, 1940-1997" ) {
	isCaliforniaDeathIndex = true;
} else if (elements[0].innerHTML == "in the 1910 United States Federal Census" ) {
	is1910census = true
} 


if (elements[0].innerHTML == 'in the California Birth Index, 1905-1995' ||
    elements[0].innerHTML == 'in the California, U.S., Death Index, 1905-1939' ||
    elements[0].innerHTML == 'in the Florida, U.S., Death Index, 1877-1998' ||
    elements[0].innerHTML == 'in the Florida, U.S., Marriage Indexes, 1822-1875 and 1927-2001' ||
    elements[0].innerHTML == 'in the Georgia, U.S., Death Index, 1919-1998' ||
    elements[0].innerHTML == 'in the Kentucky, U.S., Birth Index, 1911-1999' ||
    elements[0].innerHTML == 'in the Minnesota, U.S., Death Index, 1908-2017' ||
    elements[0].innerHTML == 'in the Minnesota, U.S., Birth Index, 1935-2000' ||
    elements[0].innerHTML == 'in the Nebraska, U.S., Birth Ledgers, 1904-1911, Birth Index, 1912-1994' ||
    elements[0].innerHTML == 'in the Oregon, U.S., Death Index, 1898-2008' ||
    elements[0].innerHTML == 'in the Texas, U.S., Birth Index, 1903-1997' ||
    elements[0].innerHTML == 'in the Texas, U.S., Death Index, 1903-2000' ||
    elements[0].innerHTML == 'in the Texas, U.S., Marriage Index, 1824-2017' ||
    elements[0].innerHTML == 'in the Wisconsin, U.S., Death Records, 1959-2004') {
	addCounty = true; 
} 


/***********************
 * Check checkboxes
 ***********************/

addChecks('eventItem updateMergeItem hasAltPref');
addChecks('eventItem updateEventItem diffItem hasAltPref');
addChecks('eventItem updateEventItem hasAltPref');
addChecks('eventItem descItem newItem');

elements = document.getElementsByClassName ('eventItem descItem  newItem');

for (i = 0; i < elements.length; i++) {
	elements[i].classList.remove('checked');
}

elements = document.getElementsByClassName ('radio altPrefRadio');

for (i = 0; i < elements.length; i++) {
  if (elements[i].id.substring(0,4) == '_pre' ) {
    elements[i].classList.remove('checked');
  } else {
    elements[i].classList.add('checked');
    elements[i].checked = true;
  }
}

elements = document.getElementsByClassName ('recTbl altItem');
for (i = 0; i < elements.length; i++) {
  elements[i].classList.remove('hide');
}

elements = document.getElementsByClassName ('recTbl wasItem');
for (i = 0; i < elements.length; i++) {
  elements[i].classList.add('hide');
}

elements = document.getElementsByClassName ('mergeCheck');
for (i = 0; i < elements.length; i++) {
 	if (elements[i].tagName == 'A') {
   		elements[i].classList.add('checked');
 	}
}

elements = document.getElementsByClassName ('secItem matchedItem deselected');
elen = elements.length;
for (i = elen; i > 0; i=i-1) {
 	elements[i-1].classList.remove('deselected');
}

elements = document.getElementsByClassName ('secItem newItem deselected');
elen = elements.length;
for (i = elen; i > 0; i=i-1) {
	elements[i-1].classList.remove('deselected');
}

/***********************
 * Set up hidden inputs
 ***********************/
var altFields = new Array();
var altFieldTags = new Array();
var dataNorms = new Array();
var altChecks = new Array();

elements = document.getElementsByClassName ('alternates');

for (i = 0; i < elements.length; i++) {
	
  fields = elements[i].getElementsByClassName ('field');
  
  for (j = 0; j < fields.length / 2; j++) {
    altFields.push(fields[j].innerHTML);
    
    if(fields[j].attributes.length == 1) {
      dataNorms.push('');
    } else {
      dataNorms.push(fields[j].attributes[1]);
    }
  }
  
  if (fields.length == 2) {
    altFields.push('');
    altFields.push('');
    dataNorms.push('');
    dataNorms.push('');
  }
}

elements = document.getElementsByClassName ('radio altPrefRadio');

for (i = 0; i < elements.length; i++) {
  
  if (elements[i].id.substring(0,4) == '_pre' ) {
    elements[i].classList.remove('checked');
  } else {
    elements[i].classList.add('checked');
    elements[i].checked = true;
  }

  if (elements[i].id.substring(0,15) == '_prefRadiofield' ) {
  	altFieldTags.push(elements[i].id.substring(15));
    altFieldTags.push('');
    altFieldTags.push('');
  } else if (elements[i].id.substring(0,10) == '_prefRadio' ) {
		altFieldTags.push('1' + elements[i].id.substring(10) );
    altFieldTags.push('2' + elements[i].id.substring(10) );
    altFieldTags.push('3' + elements[i].id.substring(10) );
  } else if (elements[i].id.substring(0,9) == '_altRadio' ) {
  	altChecks.push('altChk' + elements[i].id.substring(9));
  }
  
}

elements = document.getElementsByClassName ('alternates');

for (i = 0; i < elements.length; i++) {
  fields = elements[i].getElementsByClassName ('altField');
  
  for (j = 0; j < fields.length; j++) {
    
    if (altFields[i * 3 + j] != '') {
      tag = altFieldTags[i * 3 + j];

    	if ( isUSVeteransGravesites && tag == '1_0_0' ) { 
    		// remove duplicate middle initial or name
        parts = altFields[i * 3 + j].split(' ');
      	if (parts.length > 1) {
        	parts.pop();
        	altFields[i * 3 + j] = parts.join(' ');
      	}
    	}
      
      fields[j].innerHTML = createInput(tag, altFields[i * 3 + j]);
      
      if (dataNorms[i * 3 + j] != '') {
        if (dataNorms[i * 3 + j].value.includes(",")) {
          fields[j].innerHTML = fields[j].innerHTML + createInput(tag + '_GPID', dataNorms[i * 3 + j].value);
        } else {
          fields[j].innerHTML = fields[j].innerHTML + createInput(tag + '_ND', dataNorms[i * 3 + j].value);
        }
      }
    }    
  }
}

elements = document.getElementsByClassName ('eventItem descItem newItem');

for (i = 0; i < elements.length; i++) {
	divs = elements[i].getElementsByClassName ('recDiv');
  
  divs[1].style = 'display: none;';
}

for (i = 0; i < altChecks.length; i++) {
	elements = document.getElementById (altChecks[i]);
  elements.value = "1";
}

elements = document.getElementsByClassName ('editTextField textdefault textsml');

for (i = 0; i < elements.length; i++) {
	elements[i].innerHTML = '';
}

elements = document.getElementsByClassName ('nodeChecked');
for (i = 0; i < elements.length; i++) {
	elements[i].value = '1';
}


/***********************
 * Clean up fields
 ***********************/

var fields = new Array();

elements = document.getElementsByClassName ('dateField');

for (i = 0; i < elements.length; i++) {
	fields.push(elements[i].id.substring(5));
}

for (i = 0; i < fields.length; i++) {
  elements = document.getElementById( 'field' + fields[i] );
  elements.value = formatDate(elements.value, is1940census);
  
  elements = document.getElementById( 'altfield' + fields[i] );
  if (elements) {
  	elements.value = formatDate(elements.value, is1940census);
  }
}

if (is1910census == true) {
  for (i = 0; i < fields.length; i++) {
		parts = fields[i].split("_");
    
    if (parts[0] == 1 && parts[2] == 1) {
        elements = document.getElementById( 'altfield' + fields[i] );
      
        initial_value = ""
      	if (elements) {
          initial_value = elements.value;
          elements.value = "Abt. " + elements.value;
        }
      
      	elements = document.getElementById( 'field' + fields[i] );
        if (elements) {
          if (initial_value == "") {
	          elements.value = "Abt. " + elements.value;
          }
        }
    }
  }
}


fields = new Array();

elements = document.getElementsByClassName ('placeField');

for (i = 0; i < elements.length; i++) {
	fields.push(elements[i].id.substring(5));
}

for (i = 0; i < fields.length; i++) {
  elements = document.getElementById( 'field' + fields[i] );
  elements.value = formatPlace(elements.value);

  elements = document.getElementById( 'altfield' + fields[i] );
  if (elements) {
  	elements.value = formatPlace(elements.value);
  }
}

if (isCaliforniaDeathIndex == true) {
  elements = document.getElementById( 'field' + fields[fields.length -1] );
  if ( elements.value.includes(',') == false ) {
  	elements.value = elements.value + ' County, California, USA';  
  }  

  elements = document.getElementById( 'altfield' + fields[fields.length -1] );
  if (elements) {
  	elements.value = elements.value + ' County, California, USA'; 
  }  
}

if (isMinnesotaDeathIndex == true) {
  elements = document.getElementById( 'field' + fields[fields.length -1] );
  if ( elements.value.includes(',') == false ) {
    elements.value = elements.value + ' County, Minnesota, USA';  
  }  

  elements = document.getElementById( 'altfield' + fields[fields.length -1] );
  if (elements) {
  	elements.value = elements.value + ' County, Minnesota, USA'; 
  }  
}

if (addCounty == true) {
  elements = document.getElementById( 'altfield' + fields[fields.length -1] );
  
  alt_value = ""
  if ( elements != null) {
  
    alt_value = elements.value
  
    if ( elements.value.includes(',') == true ) {
      position = elements.value.search(",");
      elements.value = elements.value.substring(0, position) + ' County' + elements.value.substring(position);
    }
  }
  
  elements = document.getElementById( 'field' + fields[fields.length -1] );
  if ( (elements.value == alt_value || alt_value == "" ) && elements.value.includes(',') == true ) {
    position = elements.value.search(",");
    elements.value = elements.value.substring(0, position) + ' County' + elements.value.substring(position);  
  }  
}

fields = new Array();

elements = document.getElementsByClassName ('givenField');

for (i = 0; i < elements.length; i++) {
	fields.push(elements[i].id.substring(5));
}

for (i = 0; i < fields.length; i++) {
  elements = document.getElementById( 'field' + fields[i] );
  
  if (elements) {
  	parts = elements.value.split(" ");
    
    for (j = 0; j < parts.length; j++) {
			if (parts[j].length == 1) {
        parts[j] += "."
      }
    }
  	elements.value = parts.join(" ");
  }
}

for (i = 0; i < fields.length; i++) {
  elements = document.getElementById( 'altfield' + fields[i] );
  
  if (elements) {
  	parts = elements.value.split(" ");
    
    for (j = 0; j < parts.length; j++) {
			if (parts[j].length == 1) {
        parts[j] += "."
      }
    }
    elements.value = parts.join(" ");
  }
}
