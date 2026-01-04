( ( exports ) => {
'use strict';

const
    version = '1.0.1',
    
    execute = async ( promise_functions, max_concurrent_worker = 10 ) => {
        let concurrent_workers = Array( max_concurrent_worker ).fill( null ),
            waiting_worker_queue = [],
            success_list = [],
            failure_list = [],
            
            log_debug = ( header ) => {
                if ( ! exports.debug_mode ) {
                    return;
                }
                if ( header ) {
                    console.log( header );
                }
                console.log( '- concurrent_workers:', concurrent_workers );
                console.log( '- waiting_worker_queue:', waiting_worker_queue );
                console.log( '- success_list:', success_list );
                console.log( '- failure_list:', failure_list );
            },
            
            attempt_work_delegation = () => {
                log_debug( '*** attempt_work_delegation()' );
                
                if ( waiting_worker_queue.length <= 0 ) {
                    return;
                }
                
                let target_worker_id = -1;
                
                for ( let worker_id = 0; worker_id < concurrent_workers.length; worker_id ++ ) {
                    if ( ! concurrent_workers[ worker_id ] ) {
                        target_worker_id = worker_id;
                        break;
                    }
                }
                
                if ( target_worker_id < 0 ) {
                    return;
                }
                
                let target_worker = concurrent_workers[ target_worker_id ] = waiting_worker_queue.shift(),
                    target_promise = target_worker.promise = target_worker.promise_function(),
                    
                    finish = ( is_success, result ) => {
                        target_worker.is_success = is_success;
                        target_worker.result = result;
                        ( is_success ? success_list : failure_list ).push( target_worker );
                        target_worker.resolve( result );
                        concurrent_workers[ target_worker_id ] = null;
                        attempt_work_delegation();
                    };
                
                target_worker.worker_id = target_worker_id;
                
                target_promise
                .then( ( result ) => {
                    finish( true, result );
                } )
                .catch( ( result ) => {
                    finish( false, result );
                } );
            },
            
            add_worker = ( worker ) => {
                waiting_worker_queue.push( worker );
                attempt_work_delegation();
            },
            
            wrap_promise_function = ( promise_function, call_index ) => {
                return new Promise( ( resolve, reject ) => {
                    add_worker( {
                        call_index : call_index,
                        promise_function : promise_function,
                        resolve : resolve,
                        reject : reject,
                    } );
                } );
            },
            
            promise_results = await Promise.all( promise_functions.map( ( promise_function, call_index ) => wrap_promise_function( promise_function, call_index ) ) );
        
        success_list.sort( ( a, b ) => a.call_index - b.call_index );
        failure_list.sort( ( a, b ) => a.call_index - b.call_index );
        
        log_debug( '*** concurrent_executor() : end' );
        
        let result_info = {
                promise_results : promise_results,
                success_list : success_list,
                failure_list : failure_list,
            };
        
        if ( exports.debug_mode ) {
            Object.assign( result_info, {
                waiting_worker_queue : waiting_worker_queue,
                concurrent_workers : concurrent_workers,
            } );
        }
        
        return result_info;
    };

Object.assign( exports, {
    version : version,
    execute : execute,
    debug_mode : false,
} );

} )( ( typeof exports != 'undefined' ) ? exports : ( ( typeof window != 'undefined' ) ? window : this )[ 'concurrent_promise' ] = {} );
