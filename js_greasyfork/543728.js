function convert_to_unicode()
{

var array_one = new Array( 

"ç","˜",".","'m","]m","Fmf","Fm",

")","!","@","#","$","%","^","&","*","(",

"k|m","em","km","Qm","qm","N˜",
"¡","¢","1","2","4",">","?","B","I","Q","ß",
"q","„","‹","•","›","§","°","¶","¿","Å",   
"Ë","Ì","Í","Î","Ý","å",
"6«","7«","8«","9«",

"Ø","|",

"8Þ","9Þ",

"S","s","V","v","U","u","£","3","ª",
"R","r","5","H","h","‰","´","~", "`",

"6","7","8","9","0",
"T","t","Y","y","b","W","w","G","g",  

"K","k","ˆ","A","a","E", "e","D","d",
"o","/","N","n","J", "j", "Z","z","i",":",";","X","x", 

"cf‘","c‘f","cf}","cf]","cf","c","O{","O","pm","p","C","P]","P",

"f‘","\"","'","+","f","[","\\","]","}","F", "L","M",

"्ा","्ो","्ौ","अो","अा","आै","आे","ाो","ाॅ","ाे",
"ंु","ेे","अै","ाे","अे","ंा","अॅ","ाै","ैा","ंृ",
"ँा","ँू","ेा","ंे")     // Remove typing mistakes in the original file

//"_","Ö","Ù","Ú","Û","Ü","Þ","Æ","±","-","<","=")    // Punctuation marks

var array_two = new Array(

"ॐ","ऽ","।","m'","m]","mfF","mF",

"०","१","२","३","४","५","६","७","८","९",

"फ्र","झ","फ","क्त","क्र","ल",
"ज्ञ्","द्घ","ज्ञ","द्द","द्ध","श्र","रु","द्य","क्ष्","त्त","द्म", 
"त्र","ध्र","ङ्घ","ड्ड","द्र","ट्ट","ड्ढ","ठ्ठ","रू","हृ",   
"ङ्ग","त्र","ङ्क","ङ्ख","ट्ठ","द्व",
"ट्र","ठ्र","ड्र","ढ्र",

"्य","्र",

"ड़","ढ़",

"क्","क","ख्","ख","ग्","ग","घ्","घ", "ङ",
"च्","च","छ","ज्","ज","झ्","झ","ञ्", "ञ",

"ट","ठ","ड","ढ","ण्",
"त्","त","थ्","थ","द","ध्","ध","न्","न",  

"प्","प","फ्","ब्","ब","भ्","भ","म्","म",
"य","र","ल्","ल","व्","व","श्","श","ष्","स्","स","ह्","ह",

"ऑ","ऑ","औ","ओ","आ","अ","ई","इ","ऊ","उ","ऋ","ऐ","ए",

"ॉ","ू","ु","ं","ा","ृ","्","े","ै","ँ","ी","ः",

"","े","ै","ओ","आ","औ","ओ","ो","ॉ","ो",
"ुं","े","अ‍ै","ो","अ‍े","ां","अ‍ॅ","ौ","ौ","ृं",
"ाँ","ूँ","ो","ें")     // Remove typing mistakes in the original file 

//  ")","=", ";", "’","!","%",".","”","+","(","?",".")       // Punctuation marks

//**************************************************************************************
// The following two characters are to be replaced through proper checking of locations:
//**************************************************************************************
//  "l", 
//  "ि",
//
// "{"
// "र्" (reph) 
//**************************************************************************************

var array_one_length = array_one.length ;

if (  (document.getElementById("text_or_html")).selectedIndex == 0 )  // if the input is plain text
{ 
    document.getElementById("unicode_text").value = "You have chosen SIMPLE TEXT in Preeti to convert into Unicode."  ;  

    var modified_substring = document.getElementById("legacy_text").value  ;

//****************************************************************************************
//  Break the long text into small bunches of max. max_text_size  characters each.
//****************************************************************************************
    var text_size = document.getElementById("legacy_text").value.length ;

    var processed_text = '' ;  //blank

//**********************************************
//    alert("text size = "+text_size);
//**********************************************

    var sthiti1 = 0 ;  var sthiti2 = 0 ;  var chale_chalo = 1 ;
 
    var max_text_size = 6000;

    while ( chale_chalo == 1 ) 
    {
     sthiti1 = sthiti2 ; 

     if ( sthiti2 < ( text_size - max_text_size ) )  
     { 
      sthiti2 +=  max_text_size ;
      while (document.getElementById("legacy_text").value.charAt ( sthiti2 ) != ' ') {sthiti2--;}
     } 
     else  { sthiti2 = text_size  ;  chale_chalo = 0 }
      
//   alert(" sthiti 1 = "+sthiti1); alert(" sthit 2 = "+sthiti2) 

     var modified_substring = document.getElementById("legacy_text").value.substring ( sthiti1, sthiti2 )  ;

    Replace_Symbols( ) ;

    processed_text += modified_substring ;
     

//****************************************************************************************
//  Breaking part code over
//****************************************************************************************
//  processed_text = processed_text.replace( /mangal/g , "SUCHI-DEV-708 " ) ;   

    document.getElementById("unicode_text").value = processed_text  ;
   }

}

else    // if input is HTML then

{

document.getElementById("unicode_text").value = "You have chosen HTML TEXT in SUCHI-DEV-708  to convert into Unicode."  ;  

var remaining_text = document.getElementById("legacy_text").value ;
var processed_text = "" ;  //blank initially

var position_of_current_opening_bracket = 0 ;
var position_of_next_closing_bracket = 1 ;

var idx = remaining_text.indexOf( "<p " )  // search starting from paragraphs. then search for sanskrit 99.
idx = remaining_text.indexOf( "Sanskrit 99" , idx )
var idx2 = 0  //  position_of_current_opening_bracket  ">"
var idx3 = 0  //  position of "/span"
var idx4 = 0  //  postion of "span" only , ie span without "/"

while ( idx != -1 )    // while-01 loop     ;  while "Sanskrit 99"  is found..

{  
idx2 = remaining_text.indexOf( ">" , idx )  
idx3 = remaining_text.indexOf( "/span" , idx2 )
idx4 = remaining_text.indexOf( "span" , idx2 )


while ( idx4 < idx3 )     // this loop to take care of  nested span.
{
idx4 = remaining_text.indexOf( "span" , idx3+4 ) ;
idx3 = remaining_text.indexOf( "/span" , idx3+4 ) ;
}


var modified_substring = remaining_text.substring( idx2 , idx3 ) ;
modified_substring = modified_substring.replace( />/g , ">>" ) ; 
processed_text = processed_text + remaining_text.substring( 0 , idx2 ) + modified_substring + "/span" ;   

remaining_text = remaining_text.substring( idx3 + 5 ) ;  //remaining_text excludes "/span"
idx = remaining_text.indexOf( "Sanskrit 99" ) ;

} //end of outermost while-01


processed_text = processed_text + remaining_text ;


// -----------------------------

//  This section for taking care of paragraphs marked class = MsoBodyText  or class = MsoBodyText

remaining_text = processed_text ;
processed_text = "" ;  //blank initially

var position_of_start_of_paragraph = 0 ;
var position_of_end_of_paragraph = 1 ;

position_of_start_of_paragraph = remaining_text.indexOf("<p ")   ;


while ( position_of_start_of_paragraph != -1 )  //search for <p  in the remaining_text
{

position_of_start_of_paragraph = remaining_text.indexOf("<p ")   ;
position_of_end_of_paragraph = remaining_text.indexOf("/p>")   ;

modified_substring = remaining_text.substring( position_of_start_of_paragraph + 3 ,  position_of_end_of_paragraph ) ;


if ( modified_substring.indexOf( "MsoBodyText" ) != -1 )
{ 
  modified_substring = modified_substring.replace( />/g , ">>" )  ;    // repace all ">" with ">>" in this paragraph

idx = modified_substring.indexOf("font-family")  ;  // in Mybodytext, whereever font-family is found, it means it is roman text.
idx2 = 0 ;  // position of ">>"
idx3 = 0 ;  // position of "/span"
idx4 = 0 ;  // position of "span" only without "/"

while ( idx != -1 )     // again change ">>" to ">" only those which occure immediately after font-family:"Times new Roman"
{

idx2 = modified_substring.indexOf( ">>" , idx ) ;
idx3 = modified_substring.indexOf( "/span" , idx2 ) ;
idx4 = modified_substring.indexOf( "span" , idx2 ) ;


while ( idx4 < idx3 )
 {
   idx4 = modified_substring.indexOf( "span" , idx3+4 )  ;
   idx3 = modified_substring.indexOf( "/span" , idx3+4 )  ;
 }

modified_substring = modified_substring.substring( 0, idx2 ) + (modified_substring.substring( idx2 , idx3 )).replace( />>/g , ">" ) + modified_substring.substring( idx3 ) ; 
idx = modified_substring.indexOf( "font-family" , idx3 ) ;

} // end of while inner loop
} // end of if statement

processed_text = processed_text + remaining_text.substring( 0 , position_of_start_of_paragraph + 3 ) +  modified_substring + "/p>" ;   
remaining_text = remaining_text.substring( position_of_end_of_paragraph + 3 ) ; 
position_of_start_of_paragraph = remaining_text.indexOf("<p ")   ;

} // end of outer while loop

processed_text = processed_text + remaining_text ;


// ------------------------

// Now do actual font conversion  of text occuring between  all the  pairs  >>  and  <

remaining_text = processed_text ;     processed_text = "" ; 

idx2 = remaining_text.indexOf( ">>" )  ;



while ( idx2 != -1 )    // while-01 loop (checks if ">>" is still present

{  

position_of_current_opening_bracket = remaining_text.indexOf( ">>" , idx2 )  
position_of_next_closing_bracket = remaining_text.indexOf( "<" , position_of_current_opening_bracket )

modified_substring = remaining_text.substring( position_of_current_opening_bracket + 2 , position_of_next_closing_bracket ) ;

processed_text = processed_text + remaining_text.substring( 0 , position_of_current_opening_bracket + 1 ) ;   // ">" included by using +1 here
remaining_text = remaining_text.substring( position_of_next_closing_bracket + 1 ) ;  //remaining_text excludes the closing bracket


Replace_Symbols() ;   // call the subroutine and replace the legacy symbols  with corresponding Unicode.


processed_text = processed_text + modified_substring + "<"  ;

idx2 = remaining_text.indexOf( ">>" ) ;


} //end of outermost while-01



processed_text = processed_text + remaining_text ; 



// do follwing conversions which are still left  or  were done incorrectly due to unavoidable reasons.
 
// processed_text = processed_text.replace( /Sanskrit 99/g , "mangal" ) ;   

// processed_text = processed_text.replace( /ृलतष/g , "ं" )   ;  
// processed_text = processed_text.replace( /ृटुखतष/g , "घ" )  ;
// processed_text = processed_text.replace( /ृामपष/g , "ृ" )  ;
// processed_text = processed_text.replace( /ृगतष/g , ":" )  ;
// processed_text = processed_text.replace( /ृनबसपष/g , "/&nbsp" )  ; 
// processed_text = processed_text.replace( /ाॅ/g , "ॉ" )  ; 


// now put the processed text in the output box finally.

document.getElementById("unicode_text").value = processed_text  


} // end of else loop for HTML case


// --------------------------------------------------


function Replace_Symbols( )

{

//substitute array_two elements in place of corresponding array_one elements

if ( modified_substring != "" )  // if stringto be converted is non-blank then no need of any processing.
{
for ( input_symbol_idx = 0;   input_symbol_idx < array_one_length;    input_symbol_idx++ )

{ 

//  alert(" modified substring = "+modified_substring)

//***********************************************************
// if (input_symbol_idx==106) 
//  { alert(" input_symbol_idx = "+input_symbol_idx);
//    alert(" input_symbol_idx = "+input_symbol_idx)
//; alert(" character =" + modified_substring.CharCodeAt(input_symbol_idx))
//     alert(" character = "+modified_string.fromCharCode(input_symbol_idx)) 
//   }
// if (input_symbol_idx == 107) 
//   { alert(" input_symbol_idx = "+input_symbol_idx);
//    alert(" character = ",+string.fromCharCode(input_symbol_idx)) 
//   }
//***********************************************************
idx = 0  ;  // index of the symbol being searched for replacement

while (idx != -1 ) //while-00
{

modified_substring = modified_substring.replace( array_one[ input_symbol_idx ] , array_two[input_symbol_idx] )
idx = modified_substring.indexOf( array_one[input_symbol_idx] )

} // end of while-00 loop
// alert(" end of while loop")
} // end of for loop
// alert(" end of for loop")

// alert(" modified substring2 = "+modified_substring)
//*******************************************************
var position_of_i = modified_substring.indexOf( "l" )

while ( position_of_i != -1 )  //while-02
{
var charecter_next_to_i = modified_substring.charAt( position_of_i + 1 )
var charecter_to_be_replaced = "l" + charecter_next_to_i
modified_substring = modified_substring.replace( charecter_to_be_replaced , charecter_next_to_i + "ि" ) 
position_of_i = modified_substring.search( /l/ , position_of_i + 1 ) // search for i ahead of the current position.

} // end of while-02 loop

//**********************************************************************************
// End of Code for Replacing four Special glyphs
//**********************************************************************************

// following loop to eliminate 'chhotee ee kee maatraa' on half-letters as a result of above transformation.

var position_of_wrong_ee = modified_substring.indexOf( "ि्" ) 

while ( position_of_wrong_ee != -1 )  //while-03

{
var consonent_next_to_wrong_ee = modified_substring.charAt( position_of_wrong_ee + 2 )
var charecter_to_be_replaced = "ि्" + consonent_next_to_wrong_ee 
modified_substring = modified_substring.replace( charecter_to_be_replaced , "्" + consonent_next_to_wrong_ee + "ि" ) 
position_of_wrong_ee = modified_substring.search( /ि्/ , position_of_wrong_ee + 2 ) // search for 'wrong ee' ahead of the current position. 

} // end of while-03 loop

// following loop to eliminate 'chhotee ee kee maatraa' on half-letters as a result of above transformation.

var position_of_wrong_ee = modified_substring.indexOf( "िं्" ) 

while ( position_of_wrong_ee != -1 )  //while-03

{
var consonent_next_to_wrong_ee = modified_substring.charAt( position_of_wrong_ee + 3 )
var charecter_to_be_replaced = "िं्" + consonent_next_to_wrong_ee 
modified_substring = modified_substring.replace( charecter_to_be_replaced , "्" + consonent_next_to_wrong_ee + "िं" ) 
position_of_wrong_ee = modified_substring.search( /िं्/ , position_of_wrong_ee + 3 ) // search for 'wrong ee' ahead of the current position. 

} // end of while-03 loop


// Eliminating reph "Ô" and putting 'half - r' at proper position for this.
set_of_matras = "ा ि ी ु ू ृ े ै ो ौ ं : ँ ॅ" 
var position_of_R = modified_substring.indexOf( "{" )

while ( position_of_R > 0 )  // while-04
{
probable_position_of_half_r = position_of_R - 1 ;
var charecter_at_probable_position_of_half_r = modified_substring.charAt( probable_position_of_half_r )


// trying to find non-maatra position left to current O (ie, half -r).

while ( set_of_matras.match( charecter_at_probable_position_of_half_r ) != null )  // while-05

{
probable_position_of_half_r = probable_position_of_half_r - 1 ;
charecter_at_probable_position_of_half_r = modified_substring.charAt( probable_position_of_half_r ) ;

} // end of while-05


charecter_to_be_replaced = modified_substring.substr ( probable_position_of_half_r , ( position_of_R - probable_position_of_half_r ) ) ;
new_replacement_string = "र्" + charecter_to_be_replaced ; 
charecter_to_be_replaced = charecter_to_be_replaced + "{" ;
modified_substring = modified_substring.replace( charecter_to_be_replaced , new_replacement_string ) ;
position_of_R = modified_substring.indexOf( "{" ) ;

} // end of while-04

// global conversion of punctuation marks
//    "=","_","Ö","Ù","‘","Ú","Û","Ü","æ","Æ","±","-","<",  
//    ".",")","=", ";","…", "’","!","%","“","”","+","(","?",

modified_substring = modified_substring.replace( /=/g , "." )   ;  
modified_substring = modified_substring.replace( /_/g , ")" )   ;  
modified_substring = modified_substring.replace( /Ö/g , "=" )   ;  
modified_substring = modified_substring.replace( /Ù/g , ";" )   ;  
modified_substring = modified_substring.replace( /…/g , "‘" )   ;  
modified_substring = modified_substring.replace( /Ú/g , "’" )   ;  
modified_substring = modified_substring.replace( /Û/g , "!" )   ;  
modified_substring = modified_substring.replace( /Ü/g , "%" )   ;  
modified_substring = modified_substring.replace( /æ/g , "“" )   ;  
modified_substring = modified_substring.replace( /Æ/g , "”" )   ;  
modified_substring = modified_substring.replace( /±/g , "+" )   ;  
modified_substring = modified_substring.replace( /-/g , "(" )   ;  
modified_substring = modified_substring.replace( /</g , "?" )   ;  

} // end of IF  statement  meant to  supress processing of  blank  string.

} // end of the function  Replace_Symbols

} // end of legacy_to_unicode function